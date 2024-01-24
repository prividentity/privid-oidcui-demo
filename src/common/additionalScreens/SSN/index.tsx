// import { Button } from "../../../components/ui/button";
// import { Label } from "../../../components/ui/label";
// import SSN_Icon from "assets/ssn-icon.svg";
// import Layout from "../../layout";
// import { Input } from "../../../components/ui/input";
// import BackButton from "../../../common/components/backButton";
// import { useNavigateWithQueryParams } from "../../../utils/navigateWithQueryParams";
// import { useContext, useState } from "react";
// import { UserContext } from "../../../context/userContext";
// import {
//   updateTypeEnum,
//   updateUserWithSession,
//   verifyIdWithSession,
//   verifySessionTokenV2,
// } from "@privateid/cryptonets-web-sdk";
// import { getFirstRequirement } from "../../../utils";
// import { issueCredentials } from "../../../services/vc-dock";
// import CloseButton from "common/components/closeButton";

// type Props = {};

// function SSN(Props: Props) {
//   const { navigateWithQueryParams } = useNavigateWithQueryParams();
//   const context = useContext(UserContext);
//   const [ssn, setSnn] = useState("");
//   const onSubmit = async (e?: any) => {
//     e.preventDefault();
//     const sessionResult = await updateUserWithSession({
//       sessionToken: context.tokenParams,
//       updateType: updateTypeEnum.personalDetails,
//       ssn: ssn,
//     });
//     if (sessionResult?.success) {
//       await verifyIdWithSession({
//         sessionToken: context?.tokenParams,
//       });
//       const verifyTokenRes = await verifySessionTokenV2({
//         sessionToken: context?.tokenParams,
//       });
//       enum tokenStatus {
//         PENDING = "PENDING",
//         SUCCESS = "SUCCESS",
//         FAILURE = "FAILURE",
//         REQUIRES_INPUT = "REQUIRES_INPUT",
//       }
//       if (verifyTokenRes.status === tokenStatus.SUCCESS) {
//         // context.setSuccessMessage("Success! Your account is created");
//         navigateWithQueryParams("/success");
//         await issueVC(verifyTokenRes.user, true);
//       } else if (verifyTokenRes.status === tokenStatus.PENDING) {
//         navigateWithQueryParams("/failed");
//       } else if (verifyTokenRes.status === tokenStatus.FAILURE) {
//         navigateWithQueryParams("/failed");
//       } else if (verifyTokenRes.status === tokenStatus.REQUIRES_INPUT) {
//         getRequirements(verifyTokenRes?.dueRequirements);
//         // navigateWithQueryParams("/address");
//       }
//     }
//   };

//   const getRequirements = async (requirement: any) => {
//     const requirementStep = await getFirstRequirement(requirement, context);
//     switch (requirementStep) {
//       case "requestSSN9":
//         return navigateWithQueryParams("/ssn");
//       case "requireResAddress":
//         return navigateWithQueryParams("/address");
//       case "requestScanID":
//         return navigateWithQueryParams("/drivers-licence-intro");
//       default:
//         break;
//     }
//   };
//   const issueVC = async (userId: string, fullInformation: boolean) => {
//     try {
//       await issueCredentials(userId, fullInformation);
//     } catch (e) {
//       console.log({ e }, "error issueVC");
//     }
//   };
//   return (
//     <Layout>
//       <form onSubmit={onSubmit} style={{ height: "100%" }}>
//         <div className="relative flex text-center justify-center h-full">
//           <div className="relative w-full">
//             <div className="px-10 py-8 max-md:p-[20px]">
//               <div className="flex justify-between relative">
//                 <BackButton />
//                 <div className="w-full">
//                   <img
//                     src={SSN_Icon}
//                     alt=""
//                     className="w-[42px] h-[42px]  m-auto max-md:mt-[30px]"
//                   />
//                 </div>
//                 <div>{/* {Empty div to adjust space} */}</div>
//                 <CloseButton />
//               </div>
//               <div className="mt-2">
//                 <Label className="text-[28px] font-[500] text-primaryText">
//                   US Social Security Number (SSN){" "}
//                 </Label>
//               </div>
//               <div className="text-center overflow-auto h-[380px] mt-2 p-1 max-md:h-[unset]">
//                 <div className="ps-8 pe-8 max-md:p-0">
//                   <Label className="text-[14px] font-[400] text-secondaryText">
//                     Please enter the last 4 digits of your US Social Security
//                     Number (SSN) or US Individual Taxpayer Identification Number
//                     (ITIN){" "}
//                   </Label>
//                 </div>
//                 <Input
//                   placeholder="SSN4 - Social Security Number *"
//                   className="h-[48px] mt-[12px] font-[400] rounded-[8px] border-borderSecondary  {
//                 ] text-[14px] focus:outline-none  focus:ring-transparent"
//                   onChange={(e: any) => setSnn(e?.target?.value)}
//                   type="tel"
//                 />
//               </div>
//             </div>
//             <div className="text-left h-[100px] absolute w-full bottom-[25px] rounded-b-[24px] ps-10 pe-10 pb-4 max-md:relative">
//               <div>
//                 <Button
//                   className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary hover:text-white"
//                   onClick={(e) => onSubmit(e)}
//                   disabled={!ssn}
//                 >
//                   Continue
//                 </Button>
//                 <Button className="w-full text-primary bg-white rounded-[24px] mt-4 hover:opacity-90 hover:bg-white hover:text-primary">
//                   I do not know my SSN{" "}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </Layout>
//   );
// }

// export default SSN;

export default <></>