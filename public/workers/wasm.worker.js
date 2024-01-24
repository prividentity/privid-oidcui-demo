/* eslint-disable no-eval */
/* eslint-disable default-param-last */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
// importScripts('https://unpkg.com/comlink/dist/umd/comlink.js');

importScripts('./comlink.min.js');

let wasmPrivModule;
let apiUrl;
let publicKey;
let sessionToken;
let debugType;
let inputPtr;
let imageInputSize;
let barCodePtr;
let privid_wasm_result = null;
let wasmSession = null;
let isSimd;

let checkWasmLoaded = false;
let wasmPrivAntispoofModule;
let antispoofVersion;
const ModuleName = 'face_mask';

let useCdnLink = false;

const isLoad = (simd, session_token, public_key, url, timeout, debugLevel) =>
  new Promise(async (resolve, reject) => {
    apiUrl = url;
    publicKey = public_key;
    sessionToken = session_token;
    if (debugLevel) {
      debugType = debugLevel;
    }

    let timeoutSession = 5000;
    if (timeout) {
      timeoutSession = timeout;
    }
    isSimd = simd;

    const modulePath = simd ? 'simd' : 'noSimd';
    const moduleName = 'privid_fhe_oidc';
    const cachedModule = await readKey(ModuleName);

    const fetchdVersion = await (await fetch(`../wasm/${ModuleName}/${modulePath}/version.json`)).json();
    console.log('fetch?', fetchdVersion);
    console.log(
      `check version ${`${cachedModule ? cachedModule?.version.toString() : 'no cached version'} - ${
        fetchdVersion?.version
      }`}`,
    );
    // if (cachedModule && cachedModule?.version.toString() === fetchdVersion?.version.toString()) {
    //   if (!wasmPrivModule) {
    //     const { cachedWasm, cachedScript } = cachedModule;
    //     eval(cachedScript);
    //     wasmPrivModule = await createTFLiteModule({ wasmBinary: cachedWasm });
    //     if (!checkWasmLoaded) {
    //       await initializeWasmSession(apiUrl, publicKey, sessionToken, timeoutSession, debugType);
    //       checkWasmLoaded = true;
    //     }
    //   }
    //   resolve('Cache Loaded');
    // } else {
    wasmPrivModule = await loadWasmModule(modulePath, moduleName);
    console.log('Modules:', wasmPrivModule);
    if (!checkWasmLoaded) {
      await initializeWasmSession(apiUrl, publicKey, sessionToken, debugType);
      checkWasmLoaded = true;
    }
    // console.log('WASM MODULES:', wasmPrivModule);
    resolve('Loaded');
    // }
  });

function flatten(arrays, TypedArray) {
  const arr = new TypedArray(arrays.reduce((n, a) => n + a.length, 0));
  let i = 0;
  arrays.forEach((a) => {
    arr.set(a, i);
    i += a.length;
  });
  return arr;
}

async function deleteUUID(uuid, cb) {
  privid_wasm_result = cb;
  const encoder = new TextEncoder();
  const uuid_bytes = encoder.encode(`${uuid}`);

  const uuidInputSize = uuid.length;
  const uuidInputPtr = wasmPrivModule._malloc(uuidInputSize);
  wasmPrivModule.HEAP8.set(uuid_bytes, uuidInputPtr / uuid_bytes.BYTES_PER_ELEMENT);

  wasmPrivModule._privid_user_delete(wasmSession, null, 0, uuidInputPtr, uuidInputSize, 0, 0);
  wasmPrivModule._free(uuidInputPtr);
}

const isValidBarCode = async (imageInput, simd, cb, config, debug_type = 0) => {
  privid_wasm_result = cb;
  if (!wasmPrivModule) {
    await isLoad(simd, apiUrl, apiKey, wasmModule, debugType);
  }
  configGlobal = config;

  const { data: imageData } = imageInput;

  const imageInputSize = imageData.length * imageData.BYTES_PER_ELEMENT;
  if (!barCodePtr) {
    barCodePtr = wasmPrivModule._malloc(imageInputSize);
  }
  wasmPrivModule.HEAP8.set(imageData, barCodePtr / imageData.BYTES_PER_ELEMENT);

  // Cropped Document malloc
  const croppedDocumentBufferFirstPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
  const croppedDocumentBufferLenPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);

  // Cropped Barcode malloc
  const croppedBarcodeBufferFirstPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
  const croppedBarcodeBufferLenPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);

  const encoder = new TextEncoder();
  const config_bytes = encoder.encode(`${config}`);

  const configInputSize = config.length;
  const configInputPtr = wasmPrivModule._malloc(configInputSize);
  wasmPrivModule.HEAP8.set(config_bytes, configInputPtr / config_bytes.BYTES_PER_ELEMENT);

  let result = null;
  try {
    result = wasmPrivModule._privid_doc_scan_barcode(
      wasmSession,
      configInputPtr,
      configInputSize,
      barCodePtr,
      imageInput.width,
      imageInput.height,
      croppedDocumentBufferFirstPtr,
      croppedDocumentBufferLenPtr,
      croppedBarcodeBufferFirstPtr,
      croppedBarcodeBufferLenPtr,
      null,
      0,
    );
  } catch (err) {
    console.error('-----------_E_-----------', err);
  }

  // Document
  const { outputBufferData: croppedDocument, outputBufferSize: croppedDocumentSize } = getBufferFromPtr(
    croppedDocumentBufferFirstPtr,
    croppedDocumentBufferLenPtr,
  );

  // Mugshot
  const { outputBufferData: croppedBarcode, outputBufferSize: croppedBarcodeSize } = getBufferFromPtr(
    croppedBarcodeBufferFirstPtr,
    croppedBarcodeBufferLenPtr,
  );
  let imageBuffer = null;
  if (croppedBarcodeSize && croppedDocumentSize) {
    imageBuffer = getBufferFromPtrImage(barCodePtr, imageInputSize);
  }

  wasmPrivModule._free(barCodePtr);
  barCodePtr = null;
  wasmPrivModule._free(croppedDocumentBufferFirstPtr);
  wasmPrivModule._free(croppedDocumentBufferLenPtr);
  wasmPrivModule._free(croppedBarcodeBufferFirstPtr);
  wasmPrivModule._free(croppedBarcodeBufferLenPtr);
  wasmPrivModule._free(configInputPtr);

  return { result, croppedDocument, croppedBarcode, imageData: imageBuffer };
};

const scanDocument = async (imageInput, simd, cb, doPredict, config, debug_type = 0) => {
  privid_wasm_result = cb;
  if (!wasmPrivModule) {
    await isLoad(simd, apiUrl, apiKey, wasmModule, debugType);
  }
  configGlobal = config;
  // const version = wasmPrivModule._get_version();

  const encoder = new TextEncoder();
  const config_bytes = encoder.encode(`${config}`);

  const configInputSize = config.length;
  const configInputPtr = wasmPrivModule._malloc(configInputSize);
  wasmPrivModule.HEAP8.set(config_bytes, configInputPtr / config_bytes.BYTES_PER_ELEMENT);

  const { data: imageData } = imageInput;
  const imageInputSize = imageData.length * imageData.BYTES_PER_ELEMENT;

  if (!inputPtr) {
    inputPtr = wasmPrivModule._malloc(imageInputSize);
  }

  wasmPrivModule.HEAP8.set(imageData, inputPtr / imageData.BYTES_PER_ELEMENT);

  // Cropped Document malloc
  const croppedDocumentBufferFirstPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
  const croppedDocumentBufferLenPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);

  // Cropped Mugshot malloc
  const croppedMugshotBufferFirstPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
  const croppedMugshotBufferLenPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);

  let result = null;

  try {
    result = wasmPrivModule._privid_doc_scan_face(
      wasmSession,
      configInputPtr,
      configInputSize,
      inputPtr,
      imageInput.width,
      imageInput.height,
      croppedDocumentBufferFirstPtr,
      croppedDocumentBufferLenPtr,
      croppedMugshotBufferFirstPtr,
      croppedMugshotBufferLenPtr,
      null,
      0,
    );
  } catch (err) {
    console.error('-----------------ERROR---------------', err);
    return;
  }

  // Document
  const { outputBufferData: croppedDocument, outputBufferSize: croppedDocumentSize } = getBufferFromPtr(
    croppedDocumentBufferFirstPtr,
    croppedDocumentBufferLenPtr,
  );

  // Mugshot
  const { outputBufferData: croppedMugshot, outputBufferSize: croppedMugshotSize } = getBufferFromPtr(
    croppedMugshotBufferFirstPtr,
    croppedMugshotBufferLenPtr,
  );

  const imageBuffer = getBufferFromPtrImage(inputPtr, imageInputSize);

  wasmPrivModule._free(croppedDocumentBufferFirstPtr);
  wasmPrivModule._free(croppedDocumentBufferLenPtr);
  wasmPrivModule._free(croppedMugshotBufferFirstPtr);
  wasmPrivModule._free(croppedMugshotBufferLenPtr);
  wasmPrivModule._free(configInputPtr);
  wasmPrivModule._free(inputPtr);
  inputPtr = null;

  // eslint-disable-next-line consistent-return, no-param-reassign
  return {
    result,
    croppedDocument,
    croppedMugshot,
    imageData: imageBuffer,
  };
};

const getBufferFromPtr = (bufferPtr, bufferSize) => {
  const [outputBufferSize] = new Uint32Array(wasmPrivModule.HEAPU8.buffer, bufferSize, 1);
  let outputBufferSecPtr = null;
  if (outputBufferSize > 0) {
    [outputBufferSecPtr] = new Uint32Array(wasmPrivModule.HEAPU8.buffer, bufferPtr, 1);
  }

  const outputBufferPtr = new Uint8Array(wasmPrivModule.HEAPU8.buffer, outputBufferSecPtr, outputBufferSize);
  const outputBuffer = Uint8ClampedArray.from(outputBufferPtr);
  wasmPrivModule._privid_free_char_buffer(outputBufferSecPtr);
  const outputBufferData = outputBufferSize > 0 ? outputBuffer : null;
  return { outputBufferData, outputBufferSize };
};

const getBufferFromPtrImage = (bufferPtr, outputBufferSize) => {
  const outputBufferPtr = new Uint8Array(wasmPrivModule.HEAPU8.buffer, bufferPtr, outputBufferSize);
  const outputBuffer = Uint8ClampedArray.from(outputBufferPtr);
  return outputBufferSize > 0 ? outputBuffer : null;
};

const FHE_enrollOnefa = async (imageData, simd, config, cb) => {
  privid_wasm_result = cb;

  if (!wasmPrivModule) {
    await isLoad(isSimd, sessionToken, publicKey, apiUrl, timeout, debugType);
  }

  const imageInputSize = imageData.data.length * imageData.data.BYTES_PER_ELEMENT;
  const imageInputPtr = wasmPrivModule._malloc(imageInputSize);
  wasmPrivModule.HEAPU8.set(new Uint8Array(imageData.data), imageInputPtr);

  const resultFirstPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
  const resultLenPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
  const encoder = new TextEncoder();
  const config_bytes = encoder.encode(`${config}`);
  const configInputSize = config_bytes.length;
  const configInputPtr = wasmPrivModule._malloc(configInputSize);
  const bestImageFirstPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
  const bestImageLenPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
  wasmPrivModule.HEAP8.set(config_bytes, configInputPtr / config_bytes.BYTES_PER_ELEMENT);
  console.log('Config:', config);
  try {
    wasmPrivModule._privid_enroll_onefa(
      wasmSession /* session pointer */,
      configInputPtr,
      configInputSize,
      imageInputPtr /* input images */,
      1 /* number of input images */,
      imageData.data.length /* size of one image */,
      imageData.width /* width of one image */,
      imageData.height /* height of one image */,
      bestImageFirstPtr,
      bestImageLenPtr,
      resultFirstPtr /* operation result output buffer */,
      resultLenPtr /* operation result buffer length */,
    );
  } catch (e) {
    console.error('---------__E__-------', e);
  }

  let bestImage = null;

  const [outputBufferSize] = new Uint32Array(wasmPrivModule.HEAPU8.buffer, bestImageLenPtr, 1);

  if (outputBufferSize > 0) {
    let outputBufferSecPtr = null;
    [outputBufferSecPtr] = new Uint32Array(wasmPrivModule.HEAPU8.buffer, bestImageFirstPtr, 1);
    const outputBufferPtr = new Uint8Array(wasmPrivModule.HEAPU8.buffer, outputBufferSecPtr, outputBufferSize);
    const outputBuffer = Uint8ClampedArray.from(outputBufferPtr);
    const outputBufferData = outputBufferSize > 0 ? outputBuffer : null;
    bestImage = { imageData: outputBufferData, width: imageData.width, height: imageData.height };
  }

  wasmPrivModule._free(imageInputPtr);
  wasmPrivModule._free(resultFirstPtr);
  wasmPrivModule._free(resultLenPtr);
  wasmPrivModule._free(configInputPtr);
  wasmPrivModule._free(bestImageFirstPtr);
  wasmPrivModule._free(bestImageLenPtr);
  console.log('Best Image?', bestImage);
  return bestImage;
};

const FHE_predictOnefa = async (originalImages, simd, config, cb) => {
  privid_wasm_result = cb;
  if (!wasmPrivModule) {
    await isLoad(simd, sessionToken, publicKey, apiUrl, timeout, debugType);
  }

  const numImages = originalImages.length;
  const imageInput = flatten(
    originalImages.map((x) => x.data),
    Uint8Array,
  );
  // const version = wasmPrivModule._get_version();

  const encoder = new TextEncoder();
  const config_bytes = encoder.encode(`${config}`);

  const configInputSize = config.length;
  const configInputPtr = wasmPrivModule._malloc(configInputSize);
  wasmPrivModule.HEAP8.set(config_bytes, configInputPtr / config_bytes.BYTES_PER_ELEMENT);

  const imageInputSize = imageInput.length * imageInput.BYTES_PER_ELEMENT;
  const imageInputPtr = wasmPrivModule._malloc(imageInputSize);

  wasmPrivModule.HEAP8.set(imageInput, imageInputPtr / imageInput.BYTES_PER_ELEMENT);

  const resultFirstPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
  // create a pointer to interger to hold the length of the output buffer
  const resultLenPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
  console.log('Config:', config);
  try {
    await wasmPrivModule._privid_face_predict_onefa(
      wasmSession /* session pointer */,
      configInputPtr,
      configInputSize,
      imageInputPtr /* input images */,
      numImages /* number of input images */,
      originalImages[0].data.length /* size of one image */,
      originalImages[0].width /* width of one image */,
      originalImages[0].height /* height of one image */,
      resultFirstPtr /* operation result output buffer */,
      resultLenPtr /* operation result buffer length */,
    );
  } catch (e) {
    console.error('---------__E__-------', e);
  }

  wasmPrivModule._free(imageInputPtr);
  wasmPrivModule._free(configInputPtr);
  wasmPrivModule._free(resultFirstPtr);
  wasmPrivModule._free(resultLenPtr);
};

const prividAgePredict = async (
  data,
  width,
  height,
  simd,
  config = JSON.stringify({ input_image_format: 'rgba' }),
  cb,
) => {
  privid_wasm_result = cb;

  if (!wasmPrivModule) {
    await isLoad(simd, apiUrl, apiKey, wasmModule, debugType);
  }

  const imageSize = data.length * data.BYTES_PER_ELEMENT;

  const isValidPtr = wasmPrivModule._malloc(imageSize);
  wasmPrivModule.HEAP8.set(data, isValidPtr / data.BYTES_PER_ELEMENT);

  const resultFirstPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
  // create a pointer to interger to hold the length of the output buffer
  const resultLenPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);

  const encoder = new TextEncoder();
  const config_bytes = encoder.encode(`${config}`);
  const configInputSize = config.length;
  const configInputPtr = wasmPrivModule._malloc(configInputSize);
  wasmPrivModule.HEAP8.set(config_bytes, configInputPtr / config_bytes.BYTES_PER_ELEMENT);

  try {
    await wasmPrivModule._privid_estimate_age(
      wasmSession,
      isValidPtr,
      width,
      height,
      configInputPtr,
      configInputSize,
      resultFirstPtr,
      resultLenPtr,
    );
  } catch (e) {
    console.error('_____ PREDICT AGE: ', e);
  }

  wasmPrivModule._free(isValidPtr);
  wasmPrivModule._free(configInputPtr);
  wasmPrivModule._free(resultFirstPtr);
};

const isValidFrontDocument = async (imagePtr, width, height, simd, action, debug_type = 0, cb) => {
  privid_wasm_result = cb;

  if (!wasmPrivModule) {
    await isLoad(simd, apiUrl, apiKey, wasmModule, debug_type);
  }

  const result = wasmPrivModule._is_valid(action, imagePtr, width, height, 0, 0, 0);
  wasmPrivModule._free(imagePtr);

  return result;
};

function readKey(key) {
  if (!indexedDB) return Promise.reject(new Error('IndexedDB not available'));

  return new Promise((resolve, reject) => {
    const open = indexedDB.open('/privid-wasm', 21);

    open.onerror = function () {
      resolve(false);
    };

    open.onupgradeneeded = function () {
      open.result.createObjectStore('/privid-wasm');
    };

    open.onsuccess = function () {
      const db = open.result;
      const tx = db.transaction('/privid-wasm', 'readwrite');
      const store = tx.objectStore('/privid-wasm');
      const getKey = store.get(key);

      getKey.onsuccess = function () {
        resolve(getKey.result);
      };

      tx.onerror = function () {
        reject(tx.error);
      };

      tx.oncomplete = function () {
        try {
          db.close();
        } catch (e) {
          //
          console.error('readKey', e);
        }
      };
    };
  });
}

function putKey(key, cachedWasm, cachedScript, version) {
  if (!indexedDB) return Promise.reject(new Error('IndexedDB not available'));

  return new Promise((resolve, reject) => {
    const open = indexedDB.open('/privid-wasm', 21);

    open.onerror = function () {
      resolve(false);
    };

    open.onupgradeneeded = function () {
      open.result.createObjectStore('/privid-wasm');
    };

    open.onsuccess = function () {
      const db = open.result;
      const tx = db.transaction('/privid-wasm', 'readwrite');
      const store = tx.objectStore('/privid-wasm');
      const getKey = store.put({ cachedWasm, cachedScript, version }, key);

      getKey.onsuccess = function () {
        resolve('saved');
      };

      tx.onerror = function () {
        reject(tx.error);
      };

      tx.oncomplete = function () {
        try {
          db.close();
        } catch (e) {
          //
          console.error('putKey', e);
        }
      };
    };
  });
}

/**
 * @brief A closure to create a string buffer arguments that can be used with wasm calls
 * for a given javascript value.
 * This is suitable for native calls that have string input arguments represented with contigious
 * string_buffer,sizeofbuffer arguments.
 * If the 'text' argument is null or undefined or NaN then the arguments generated  are [null,0]
 * @usage
 *
 var url_args= buffer_args(url);
 var key_args= buffer_args(key);
 var session_out_ptr = output_ptr();
 const s_result = wasmPrivModule._privid_initialize_session(
      ...key_args.args(),
      ...url_args.args(),
      debug_type,
      session_out_ptr.outer_ptr(),
    );
    url_args.free();
    key_args.free();
    //get
    var session = session_out_ptr.inner_ptr();
 *
 *  when .free() is called the closure can be reused to create a buffer for the same string with which, it was created with
 *  over and over again.
 */
const buffer_args = function (text) {
  let strInputtPtr = null;
  let strInputSize = 0;
  let argsv = [];
  return {
    args: () => {
      do {
        if (argsv.length > 0) break;
        argsv = [null, 0];
        if (text === null) break;
        if (text === undefined) break;
        // eslint-disable-next-line use-isnan
        if (text === NaN) break;
        const str = `${text}`;
        const encoder = new TextEncoder();
        const bytes = encoder.encode(str);
        strInputSize = bytes.length * bytes.BYTES_PER_ELEMENT;
        strInputtPtr = wasmPrivModule._malloc(strInputSize);
        wasmPrivModule.HEAP8.set(bytes, strInputtPtr / bytes.BYTES_PER_ELEMENT);
        argsv = [strInputtPtr, strInputSize];
      } while (false);
      return argsv;
    },
    free: () => {
      if (strInputtPtr) {
        wasmPrivModule._free(strInputtPtr);
        strInputtPtr = null;
        strInputSize = 0;
        argsv = [];
      }
    },
  };
};

/**
 * @brief A closure to create an output 32bits pointer closure.
 * This is usefull for allocating a native address and pass it to the
 * 'wasmPrivModule' so it can return in the address of a buffer (or an object like session)
 * that was allocated inside the wasm. This typically, correspond to
 * an argument of type void** (marked output argument) to pass to a native wasm
 * call.
 * @usage var myoutput_ptr = output_ptr();
 * when passing the output pointer to the 'wasmPrivModule' module use
 * wasmPrivModule.nativecall(myoutput_ptr.outer_ptr());
 * Then pull out the the allocated buffer by the wasm call this way:
 * @code
 * my_buffer_or_structure = myoutput_ptr.inner_ptr();
 * @note It is the responsability of the caller to free the pointer returned by this inner_ptr()
 */
const output_ptr = function () {
  let out_ptr = null;
  let in_ptr = null;
  const free_ptr = (ptr) => {
    if (ptr) {
      wasmPrivModule._free(ptr);
      // eslint-disable-next-line no-param-reassign
      ptr = null;
    }
  };
  return {
    /**
     * @brief  Allocates a pointer to contain the result and return it,
     * if the container is already created it will be returned
     */
    outer_ptr: () => {
      // TODO: may be used SharedArrayBuffer() instead
      // allocate memory the expected pointer (outer pointer or container)
      if (!out_ptr) out_ptr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
      return out_ptr;
    },
    /**
     * @brief Creates a javascript Uint32Array pointer to contain the result pointed by outer_ptr and return it,
     * It is the responsability of the caller to free the pointer returned by this function
     */
    inner_ptr: () => {
      //  If we did not allocate yet the output buffer return null
      if (!out_ptr) return null;
      // if we already have our inner pointer for this closure return it
      if (in_ptr) return in_ptr;
      // Access  the outer pointer as an arry of uint32 which conatin a single cell
      // whose value is the pointer allocated in the wasm module (inner pointer of the output param)
      // and return it
      [in_ptr] = new Uint32Array(wasmPrivModule.HEAPU8.buffer, out_ptr, 1);
      return in_ptr;
    },
  };
};

async function initializeWasmSession(apiUrl, publicKey, sessionToken, debugType) {
  if (!wasmSession) {
    const initializationArgs = {
      named_urls: [{ url_name: 'base_url', url: apiUrl }],
      public_key: publicKey,
      session_token: sessionToken,
      debug_level: 'debug',
    };
    console.log('Args', initializationArgs);
    const initializationArgsString = JSON.stringify(initializationArgs);
    console.log('STRING ARGS:', initializationArgsString);
    const initArgs = buffer_args(initializationArgsString);

    const session_out_ptr = output_ptr();

    let s_result = '';
    try {
      s_result = await wasmPrivModule._privid_initialize_session(...initArgs.args(), session_out_ptr.outer_ptr());
    } catch (e) {
      console.log('Error:', e);
    }

    console.log('after initialize');
    initArgs.free();
    wasmPrivModule._free(session_out_ptr.inner_ptr);
    if (s_result) {
      console.log('[DEBUG] : session initialized successfully');
    } else {
      console.log('[DEBUG] : session initialized failed');
      return;
    }

    // get our inner session created by wasm and free the outer container ptr
    wasmSession = session_out_ptr.inner_ptr();

    await wasmPrivModule._privid_set_default_configuration(wasmSession, 1);
  } else {
    console.log('Wasm session is available. Skipping creating session');
  }
}

const scanDocumentNoFace = async (imageInput, simd, cb, config, debug_type = 0) => {
  privid_wasm_result = cb;

  if (!wasmPrivModule) {
    await isLoad(simd, apiUrl, apiKey, wasmModule, debugType);
  }
  configGlobal = config;
  const encoder = new TextEncoder();
  const config_bytes = encoder.encode(`${config}`);

  const configInputSize = config.length;
  const configInputPtr = wasmPrivModule._malloc(configInputSize);
  wasmPrivModule.HEAP8.set(config_bytes, configInputPtr / config_bytes.BYTES_PER_ELEMENT);

  const { data: imageData } = imageInput;
  const imageInputSize = imageData.length * imageData.BYTES_PER_ELEMENT;

  if (!inputPtr) {
    inputPtr = wasmPrivModule._malloc(imageInputSize);
  }

  wasmPrivModule.HEAP8.set(imageData, inputPtr / imageData.BYTES_PER_ELEMENT);

  // Cropped Document malloc
  const croppedDocumentBufferFirstPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
  const croppedDocumentBufferLenPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);

  let result = null;

  try {
    result = wasmPrivModule._privid_scan_document_with_no_face(
      wasmSession,
      configInputPtr,
      configInputSize,
      inputPtr,
      imageInput.width,
      imageInput.height,
      croppedDocumentBufferFirstPtr,
      croppedDocumentBufferLenPtr,
      null,
      0,
    );
  } catch (err) {
    console.error('-----------------ERROR---------------', err);
    return;
  }

  // Document
  const { outputBufferData: croppedDocument, outputBufferSize: croppedDocumentSize } = getBufferFromPtr(
    croppedDocumentBufferFirstPtr,
    croppedDocumentBufferLenPtr,
  );

  const imageBuffer = getBufferFromPtrImage(inputPtr, imageInputSize);

  wasmPrivModule._free(croppedDocumentBufferFirstPtr);
  wasmPrivModule._free(croppedDocumentBufferLenPtr);
  wasmPrivModule._free(configInputPtr);
  wasmPrivModule._free(inputPtr);
  inputPtr = null;

  return {
    result,
    croppedDocument,
    imageData: imageBuffer,
  };
};

const loadWasmModule = async (modulePath, moduleName) => {
  const wasm = await fetch(`../wasm/face_mask/${modulePath}/${moduleName}.wasm`);
  const script = await fetch(`../wasm/face_mask/${modulePath}/${moduleName}.js`);
  // const wasm = await fetch(`../wasm/face_mask/${modulePath}/${moduleName}.wasm`);
  // const script = await fetch(`../wasm/face_mask/${modulePath}/${moduleName}.js`);
  const scriptBuffer = await script.text();
  const buffer = await wasm.arrayBuffer();
  eval(scriptBuffer);
  const module = await createTFLiteModule({ wasmBinary: buffer });

  return module;
};

// privid_compare_mugshot_and_face(void* session_ptr, const char* user_config, const int user_config_length,
//   const uint8_t* p_doc_image_in, const int doc_image_width, const int doc_image_height,
//   const uint8_t* p_face_image_in, const int face_image_width, const int face_image_height,
//   uint8_t** cropped_mughshot_out, int* cropped_mughshot_length,
//   uint8_t** cropped_face_out, int* cropped_face_length,
//   char** result_out, int* result_out_length);

const faceCompare = async (inputImageA, inputImageB, cb, config, debug_type = 0) => {
  privid_wasm_result = cb;
  if (!wasmPrivModule) {
    await isLoad(simd, sessionToken, publicKey, apiUrl, timeout, debugType);
  }

  // const version = wasmPrivModule._get_version();
  console.log('params:', { inputImageA, inputImageB, config });
  const encoder = new TextEncoder();
  const config_bytes = encoder.encode(`${config}`);

  const configInputSize = config.length;
  const configInputPtr = wasmPrivModule._malloc(configInputSize);
  wasmPrivModule.HEAP8.set(config_bytes, configInputPtr / config_bytes.BYTES_PER_ELEMENT);

  const imageInputASize = inputImageA.data.length * inputImageA.data.BYTES_PER_ELEMENT;
  const imageInputAPtr = wasmPrivModule._malloc(imageInputASize);
  wasmPrivModule.HEAP8.set(new Uint8Array(inputImageA.data), imageInputAPtr);

  // const imageInputSize = imageData.data.length * imageData.data.BYTES_PER_ELEMENT;
  // const imageInputPtr = wasmPrivModule._malloc(imageInputSize);
  // wasmPrivModule.HEAPU8.set(new Uint8Array(imageData.data), imageInputPtr);

  const imageInputBSize = inputImageB.data.length * inputImageB.data.BYTES_PER_ELEMENT;
  const imageInputBPtr = wasmPrivModule._malloc(imageInputBSize);
  wasmPrivModule.HEAP8.set(new Uint8Array(inputImageB.data), imageInputBPtr);

  const resultFirstPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
  // create a pointer to interger to hold the length of the output buffer
  const resultLenPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
  console.log({
    configInputPtr,
    configInputSize,
    imageInputAPtr,
    imageInputBPtr,
    resultFirstPtr,
    resultLenPtr,
    inputImageA,
    inputImageB,
  });

  try {
    result = wasmPrivModule._privid_compare_mugshot_and_face(
      wasmSession,
      configInputPtr,
      configInputSize,
      imageInputAPtr,
      inputImageA.width,
      inputImageA.height,
      imageInputBPtr,
      inputImageB.width,
      inputImageB.height,
      null,
      0,
      null,
      0,
      resultFirstPtr,
      resultLenPtr,
    );
  } catch (err) {
    console.error('-----------------ERROR---------------', err);
    return;
  }

  wasmPrivModule._free(configInputPtr);
  wasmPrivModule._free(imageInputAPtr);
  wasmPrivModule._free(imageInputBPtr);
  wasmPrivModule._free(resultFirstPtr);
  wasmPrivModule._free(resultLenPtr);
};

// void privid_encrypt_data(void* session_ptr, const unsigned char* buffer, const int buffer_length, char** result_out, int* result_out_length)
const pkiEnrcrypt = async (payload) => {
  const encoder = new TextEncoder();
  const payloadBytes = encoder.encode(`${payload}`);
  const payloadInputSize = payloadBytes.length;
  const payloadInputPtr = wasmPrivModule._malloc(payloadInputSize);

  const resultFirstPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
  // create a pointer to interger to hold the length of the output buffer
  const resultLenPtr = wasmPrivModule._malloc(Int32Array.BYTES_PER_ELEMENT);
  wasmPrivModule.HEAP8.set(payloadBytes, payloadInputPtr / payloadBytes.BYTES_PER_ELEMENT);
  console.log('Payload:', payload);
  let res = null;
  try {
    res = wasmPrivModule._privid_encrypt_data(
      wasmSession /* session pointer */,
      payloadInputPtr,
      payloadInputSize,
      resultFirstPtr /* operation result output buffer */,
      resultLenPtr /* operation result buffer length */,
    );
  } catch (e) {
    console.error('---------__E__-------', e);
  }

  console.log('Result?', res);

  const [outputBufferSizes] = new Uint32Array(wasmPrivModule.HEAPU8.buffer, resultLenPtr, 1);

  if (outputBufferSizes > 0) {
    // de-reference & copy the data from pointer to integer in integer array of one element
    const outputBufferSize = new Uint32Array(wasmPrivModule.HEAPU8.buffer, resultLenPtr, 1)[0];
    const outputBufferSecPtr = new Uint32Array(wasmPrivModule.HEAPU8.buffer, resultFirstPtr, 1)[0];
    const outputBufferPtr = new Uint8Array(wasmPrivModule.HEAPU8.buffer, outputBufferSecPtr, outputBufferSize);

    var decoder = new TextDecoder("utf8");
    var dec = decoder.decode(outputBufferPtr);
    console.log("len:", dec.length)
    dec.replace(/\0/g, '')
    dec.replace(" ","");
    console.log("test:", dec.length)
    function removeNullBytes(str){
      return str.split("").filter(char => char.codePointAt(0)).join("")
    }
    let parsedDec = JSON.stringify(removeNullBytes(dec));
    console.log("parsed:", parsedDec )
    let isObject = JSON.parse(parsedDec);
    console.log("is object?", isObject)
    return JSON.parse(isObject);
  }

  return { error:true }
};

Comlink.expose({
  FHE_enrollOnefa,
  FHE_predictOnefa,
  isLoad,
  scanDocument,
  scanDocumentNoFace,
  isValidBarCode,
  deleteUUID,
  faceCompare,
  pkiEnrcrypt,
});
