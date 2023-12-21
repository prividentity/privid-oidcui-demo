import { FLOW, REQUIRES_INPUT, SUCCESS } from "../../../constant";
import { UserContext } from "../../../context/userContext";
import { getUser, getUserPortrait, verifyTokenApi } from "../../../services/api";
import { convertLinkToImageData, getStatusFromUser } from "../../../utils";
import { useContext, useEffect } from "react";
import MainLogo from "../../../assets/login/logo-main.png";
import HhsLogo from "../../../assets/hhsLogo.png";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  const { setUser, user, setTokenParams, themeHhs } = useContext(UserContext);
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
        if (userPortrait?.data) {
          const enrollImageData = await convertLinkToImageData(
            userPortrait.data
          );
          setUser({ ...user, enrollImageData });
          navigate(`/drivers-licence-intro?token=${res?.token}`);
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
    <div className="flex text-center justify-center main-layout max-md:h-[99vh]">
      <div
        className={`py-10 max-w-[600px] w-[100%] ${
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
            width={themeHhs ? 70 : 181}
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
