import { FLOW, REQUIRES_INPUT, SUCCESS } from "../../constant";
import { UserContext } from "../../context/userContext";
import { getUser, getUserPortrait, verifyTokenApi } from "../../services/api";
import { convertLinkToImageData, getStatusFromUser } from "../../utils";
import { useContext, useEffect } from "react";
import MainLogo from "../../assets/login/logo-main.png";
import HhsLogo from "../../assets/hhsMainLogo.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import useWasm from "hooks/useWasm";
import { OidcContext } from "context/oidcContext";
import { getPublicKey } from "@privateid/ping-oidc-web-sdk-alpha";

type Props = {
  children?: any;
  removeBorder?: boolean;
  removeHeight?: boolean;
};
let loadded = false;
const Layout = (props: Props) => {
  const [searchParams] = useSearchParams();
  const { removeBorder, removeHeight = false } = props;
  const navigate = useNavigate();
  const { setUser, user, setTokenParams, themeHhs, setSuccessMessage } =
    useContext(UserContext);
  const oidcContext = useContext(OidcContext);
  // const getPublicKey = await getPublicKey();
  const url = process.env.REACT_APP_API_URL || "";
  const { ready: wasmReady, wasmStatus } = useWasm(
    oidcContext.transactionToken,
    url,
    "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAkUejlGQtY6fC/B8HY8lI\nCRZys4mQVgI62YI1POIAgcfEYXbrtKGpYJOtYcjgzZJ5Eg7VYKNEsAvfRDYDd+QX\nGqVgYiayIYeqDkgTNPnvrXLQVm/42pSWWYvOaq/DlJmLLpkQKwic45dg58VCP2A/\nzF29fjzfeofn2Im1xjvMs1NhfSd7uJAimEy8hV6MlZh03Z4iZmdl3+f6n8t/KR/Z\nwU6tKw6nbDWEuMyEMsUXkGRWyQvlX2/t5WvCx7xMX2LPlmXGhutYXJlG6rfu4PtN\nKDcGzQFySp1NuU+eV75eGiyfGwg33HRwab/jQr/FrtgphT5Q+sNUKSRZwWXDuGGd\n4wb0E1YwUwdJP0osxJ9v3g62PZD/id/Bec7TqNWhRAWhXux2jexwvwglWh497cJj\nkkLLG5QKJXGUh6S7f46y+TgGoXX0ME8nJM9jCu2OjBXqvVM17SiwU29XoYLrk2G1\nSCqqU6kivOW2cAeIDAYJtlYV5K9kPh4xYoWXKKFcLBcR35I8bdHjeMIHmp4Z+9Zm\nDfhByrDRHxIoz6cKThhX+DqrinKx928tQCaMth1S1uMQp+VDUnA4016yQVtf6XtY\nVfJzU8xt2cQ2nTSTMnwtcAET6GwFQSf17i0L5HiIZXzt685215K8tA6Oe41DsP5E\ngcyHe6R8lM7/HSI+7fn7MrUCAwEAAQ==\n-----END PUBLIC KEY-----"
  );
  const token = searchParams.get("token");
  const verifyTokenAPI = async (token: any) => {
    setTokenParams(token?.replace("?", ""));
    await verifyTokenApi(token).then(handleTokenVerification);
  };

  const handleTokenVerification = async (res: any) => {
    if (res?.user) {
      await handleCustomerVerification(res);
    }
  };

  const handleCustomerVerification = async (res: any) => {
    setUser({ ...user, userId: res.user });
    const isCompleted = (element: number) =>
      res.flowsCompleted.includes(element);
    try {
      if (!res.flowsCompleted.length) {
        navigate("/");
      } else if (
        res.flowsCompleted.length === 1 &&
        isCompleted(FLOW.CREATE_USER)
      ) {
        navigate(`/face-scan?token=${res?.token}`);
      } else if (
        res.flowsCompleted.length === 2 &&
        [FLOW.CREATE_USER, FLOW.UPLOAD_SELFIE].every(isCompleted)
      ) {
        const userPortrait: any = await getUserPortrait(res.token);
        console.log(userPortrait, "userPortrait");
        if (userPortrait?.data) {
          try {
            navigate(`/drivers-licence-intro?token=${res?.token}`);
            const enrollImageData = await convertLinkToImageData(
              userPortrait.data
            );
            console.log(enrollImageData, "enrollImageData");
            setUser({ ...user, enrollImageData });
          } catch (error) {
            console.error(error);
          }
        } else {
          navigate(`/failed?token=${res?.token}`);
        }
      } else if (
        res.flowsCompleted.length === 3 &&
        [FLOW.CREATE_USER, FLOW.UPLOAD_SELFIE, FLOW.UPLOAD_DOC_FRONT].every(
          isCompleted
        )
      ) {
        navigate(`/drivers-licence-back-intro?token=${res?.token}`);
      } else {
        const data: any = await getUser({ id: res.user });
        const { userApproved, requestScanID, requestResAddress, ...rest } =
          data.status || {};

        setUser({
          ...user,
          userStatus: {
            userApproved,
            requestScanID,
            requestResAddress: !requestScanID && requestResAddress,
            ...rest,
          },
        });
        handleUserStatus(userApproved, rest, res);
      }
    } catch (e) {
      navigate("/");
    }
  };

  const handleUserStatus = (userApproved: any, rest: any, res: any) => {
    const status = getStatusFromUser({ userApproved, ...rest });

    if (status === SUCCESS) {
      setSuccessMessage("Success! Your account is created");
      navigate(`/success?token=${res?.token}`);
    } else if (status === REQUIRES_INPUT) {
      navigate(`/address?token=${res?.token}`);
    } else {
      navigate(`/failed?token=${res?.token}`);
    }
  };
  useEffect(() => {
    if (!token) return;
    if (!loadded) {
      verifyTokenAPI(token);
      loadded = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, loadded]);
  return (
    <div className="flex text-center justify-center main-layout max-md:h-[calc(100vh_-_5rem)] min-[1600px]:h-[95vh]">
      <div
        className={`py-8 max-w-[600px] w-[100%] ${
          !removeBorder && "max-md:py-0"
        }`}
      >
        <div
          className={`flex justify-center ${
            themeHhs ? "h-[70px]" : "h-[34px]"
          } ${!removeBorder && "max-md:hidden"}`}
        >
          <img
            src={themeHhs ? HhsLogo : MainLogo}
            alt=""
            width={themeHhs ? 300 : 181}
            data-src={themeHhs ? HhsLogo : MainLogo}
            className={`lazyload`}
          />
        </div>
        <div
          className={`inner-layout relative ${!removeHeight && `h-[650px]`} ${
            themeHhs ? "mt-6" : "mt-10  max-md:mt-1"
          } w-full ${
            !removeBorder && `border border-border max-md:border-none`
          }  rounded-[24px] max-md:h-[100%]`}
        >
          {props?.children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
