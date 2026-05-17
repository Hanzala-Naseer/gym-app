// /* =========================================================
//    PROFESSIONAL ENTERPRISE REGISTER GYM
//    FIXED: viewport height, scrolling, all fields visible
// ========================================================= */

// import { useMemo, useState } from "react";
// import {
//   ArrowLeft,
//   ArrowRight,
//   Check,
//   Loader2,
//   Navigation,
//   UploadCloud,
//   MapPin,
//   Building2,
//   Phone,
//   Clock3,
//   FileText,
//   Globe2,
// } from "lucide-react";

// import OwnerLayout from "@/components/layouts/OwnerLayout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";

// import { useToast } from "@/hooks/use-toast";
// import { gymService } from "@/services/gymService";
// import { useAuth } from "@/contexts/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function RegisterGym() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { updateGymId } = useAuth();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [fetchingLocation, setFetchingLocation] = useState(false);

//   /* FILE STATES */
//   const [coverImage, setCoverImage] = useState(null);
//   const [photos, setPhotos] = useState([]);
//   const [ownerCnic, setOwnerCnic] = useState(null);
//   const [businessLicense, setBusinessLicense] = useState(null);
//   const [ownershipProof, setOwnershipProof] = useState(null);
//   const [utilityBill, setUtilityBill] = useState(null);

//   /* FORM STATE */
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     addressLine: "",
//     city: "",
//     province: "",
//     postalCode: "",
//     latitude: "",
//     longitude: "",
//     phoneNumber: "",
//     whatsappNumber: "",
//     instagramHandle: "",
//     websiteUrl: "",
//     googleMapsLink: "",
//     cnicNumber: "",
//     businessName: "",
//     openingTime: "",
//     closingTime: "",
//     is24Hours: false,
//     tier: "2",
//   });

//   const steps = useMemo(
//     () => [
//       { id: 1, title: "Gym Info" },
//       { id: 2, title: "Location" },
//       { id: 3, title: "Media" },
//       { id: 4, title: "Review" },
//     ],
//     [],
//   );

//   const set = (key) => (e) =>
//     setForm((prev) => ({ ...prev, [key]: e.target.value }));

//   /* VALIDATION */
//   const validateStep = () => {
//     if (currentStep === 1) {
//       if (!form.name.trim()) {
//         toast({ title: "Gym name required", variant: "destructive" });
//         return false;
//       }
//       if (form.phoneNumber && form.phoneNumber.length < 11) {
//         toast({ title: "Invalid phone number", variant: "destructive" });
//         return false;
//       }
//     }
//     if (currentStep === 2) {
//       if (
//         !form.addressLine ||
//         !form.city ||
//         !form.latitude ||
//         !form.longitude
//       ) {
//         toast({
//           title: "Address, city & coordinates required",
//           variant: "destructive",
//         });
//         return false;
//       }
//     }
//     return true;
//   };

//   const nextStep = () => {
//     if (!validateStep()) return;
//     if (currentStep < 4) setCurrentStep((p) => p + 1);
//   };

//   const previousStep = () => {
//     if (currentStep > 1) setCurrentStep((p) => p - 1);
//   };

//   /* FETCH LAT LONG */
//   const fetchLocation = async () => {
//     try {
//       setFetchingLocation(true);
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setForm((prev) => ({
//             ...prev,
//             latitude: position.coords.latitude.toFixed(7),
//             longitude: position.coords.longitude.toFixed(7),
//           }));
//           toast({
//             title: "Location fetched",
//             description: "Coordinates detected successfully",
//           });
//           setFetchingLocation(false);
//         },
//         () => {
//           toast({
//             title: "Location permission denied",
//             variant: "destructive",
//           });
//           setFetchingLocation(false);
//         },
//       );
//     } catch {
//       setFetchingLocation(false);
//     }
//   };

//   /* SUBMIT */
//   const handleSubmit = async () => {
//     try {
//       setIsLoading(true);
//       const body = new FormData();
//       body.append("name", form.name);
//       body.append("description", form.description);
//       body.append("addressLine", form.addressLine);
//       body.append("city", form.city);
//       body.append("province", form.province);
//       body.append("postalCode", form.postalCode);
//       body.append("latitude", form.latitude);
//       body.append("longitude", form.longitude);
//       body.append("phoneNumber", form.phoneNumber);
//       body.append("whatsappNumber", form.whatsappNumber);
//       body.append("instagramHandle", form.instagramHandle);
//       body.append("websiteUrl", form.websiteUrl);
//       body.append("googleMapsLink", form.googleMapsLink);
//       body.append("cnicNumber", form.cnicNumber);
//       body.append("businessName", form.businessName);
//       body.append("openingTime", form.openingTime);
//       body.append("closingTime", form.closingTime);
//       body.append("is24Hours", form.is24Hours ? "true" : "false");
//       body.append("tier", "2");

//       if (coverImage) body.append("coverImage", coverImage);
//       photos.forEach((photo) => body.append("photos", photo));
//       if (ownerCnic) body.append("ownerCnic", ownerCnic);
//       if (businessLicense) body.append("businessLicense", businessLicense);
//       if (ownershipProof) body.append("ownershipProof", ownershipProof);
//       if (utilityBill) body.append("utilityBill", utilityBill);

//       const data = await gymService.registerGym(body);
//       if (!data.success) throw new Error(data.message);
//       if (data.gym?.id) updateGymId(data.gym.id);

//       toast({
//         title: "Gym Registered",
//         description: "Your gym is pending admin approval",
//       });
//       navigate("/dashboard/owner/my-gym");
//     } catch (err) {
//       toast({
//         title: "Registration failed",
//         description: err?.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <OwnerLayout active="my-gym">
//       {/*
//         FIX 1: Use h-screen and let OwnerLayout's sidebar be position:fixed or absolute.
//         The main content area should be exactly one viewport tall with NO nested
//         h-[calc(100vh-Xpx)] inside h-[calc(100vh-Xpx)] — that double-subtracts.

//         We use flex-col on a fixed-height container, then let the body flex-1 overflow-hidden.
//       */}
//       <div className="flex flex-col h-[calc(100vh-72px)] bg-[#F5F0E8] overflow-hidden">
//         {/* ── TOP HEADER ── fixed height 56px (reduced from 72px to save space) */}
//         <div className="flex-shrink-0 h-14 border-b border-[#E5DCCF] bg-[#F7F2EA] px-6 flex items-center justify-between">
//           <h1 className="text-[17px] font-bold text-[#17120E]">
//             GymKey Enterprise
//           </h1>
//           <div className="flex items-center gap-4">
//             <button className="text-sm text-[#6B625A]">Support Portal</button>
//             <div className="w-9 h-9 rounded-full bg-[#2A1608]" />
//           </div>
//         </div>

//         {/* ── MAIN AREA: fills remaining height exactly ── */}
//         <div className="flex-1 overflow-hidden px-6 py-4">
//           <div className="h-full max-w-[1500px] mx-auto flex flex-col gap-3">
//             {/* ── PAGE HEADER + STEPS ── compact, flex-shrink-0 */}
//             <div className="flex-shrink-0 flex items-center justify-between">
//               <div>
//                 {/* FIX 2: Reduced title size from 58px → 32px to save vertical space */}
//                 <h2 className="text-[28px] leading-tight font-bold text-[#17120E] tracking-[-0.03em]">
//                   Register New Facility
//                 </h2>
//                 <p className="mt-0.5 text-[13px] text-[#655B53]">
//                   Onboard your gym into GymKey operational infrastructure.
//                 </p>
//               </div>

//               {/* STEPS */}
//               <div className="flex items-center gap-3">
//                 {steps.map((step, index) => {
//                   const active = currentStep === step.id;
//                   const completed = currentStep > step.id;
//                   return (
//                     <div key={step.id} className="flex items-center gap-2">
//                       <div
//                         className={`
//                           w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all
//                           ${active ? "bg-[#9A5A17] text-white shadow-lg" : completed ? "bg-[#2A1608] text-white" : "bg-[#E5DCCF] text-[#786E65]"}
//                         `}
//                       >
//                         {completed ? (
//                           <Check className="w-3.5 h-3.5" />
//                         ) : (
//                           step.id
//                         )}
//                       </div>
//                       <span
//                         className={`text-[13px] font-medium whitespace-nowrap ${active ? "text-[#1A120D]" : "text-[#7B6F65]"}`}
//                       >
//                         {step.title}
//                       </span>
//                       {index !== steps.length - 1 && (
//                         <div className="w-7 h-px bg-[#D9CEC1]" />
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* ── BODY: flex-1, overflow-hidden, contains the two columns ── */}
//             <div className="flex-1 overflow-hidden">
//               <div className="grid grid-cols-[1fr_300px] gap-4 h-full">
//                 {/* ── LEFT PANEL ── */}
//                 <div className="bg-[#FBF9F6] border border-[#E9DED1] rounded-[28px] flex flex-col overflow-hidden">
//                   {/* FIX 3: Scrollable area takes all remaining height between header and footer */}
//                   <div className="flex-1 overflow-y-auto p-5 pr-4 space-y-4">
//                     {/* ── STEP 1: GYM INFO ── */}
//                     {currentStep === 1 && (
//                       <div className="space-y-4">
//                         <SectionHeader
//                           icon={Building2}
//                           title="Core Details"
//                           subtitle="Business identity & public information."
//                         />

//                         <div className="grid grid-cols-2 gap-3">
//                           <Field label="Facility Name *">
//                             <Input
//                               value={form.name}
//                               onChange={set("name")}
//                               placeholder="Summit Performance Club"
//                               className={inputStyle}
//                             />
//                           </Field>
//                           <Field label="Business Name">
//                             <Input
//                               value={form.businessName}
//                               onChange={set("businessName")}
//                               placeholder="Titan Fitness Pvt Ltd"
//                               className={inputStyle}
//                             />
//                           </Field>
//                         </div>

//                         <Field label="Facility Description">
//                           {/* FIX 4: Reduced textarea rows from 5→3 so it doesn't eat all vertical space */}
//                           <Textarea
//                             rows={3}
//                             value={form.description}
//                             onChange={set("description")}
//                             placeholder="Describe your gym atmosphere, equipment & services..."
//                             className={textareaStyle}
//                           />
//                         </Field>

//                         <div className="grid grid-cols-2 gap-3">
//                           <Field label="Phone Number">
//                             <Input
//                               value={form.phoneNumber}
//                               onChange={set("phoneNumber")}
//                               placeholder="+92 300 0000000"
//                               className={inputStyle}
//                             />
//                           </Field>
//                           <Field label="WhatsApp Number">
//                             <Input
//                               value={form.whatsappNumber}
//                               onChange={set("whatsappNumber")}
//                               placeholder="+92 300 0000000"
//                               className={inputStyle}
//                             />
//                           </Field>
//                         </div>

//                         <div className="grid grid-cols-2 gap-3">
//                           <Field label="CNIC Number">
//                             <Input
//                               value={form.cnicNumber}
//                               onChange={set("cnicNumber")}
//                               placeholder="35202-1234567-1"
//                               className={inputStyle}
//                             />
//                           </Field>
//                           <Field label="Google Maps Link">
//                             <Input
//                               value={form.googleMapsLink}
//                               onChange={set("googleMapsLink")}
//                               placeholder="https://maps.google.com/..."
//                               className={inputStyle}
//                             />
//                           </Field>
//                         </div>

//                         <div className="grid grid-cols-2 gap-3">
//                           <Field label="Instagram">
//                             <Input
//                               value={form.instagramHandle}
//                               onChange={set("instagramHandle")}
//                               placeholder="@gym"
//                               className={inputStyle}
//                             />
//                           </Field>
//                           <Field label="Website URL">
//                             <Input
//                               value={form.websiteUrl}
//                               onChange={set("websiteUrl")}
//                               placeholder="https://gym.com"
//                               className={inputStyle}
//                             />
//                           </Field>
//                         </div>
//                       </div>
//                     )}

//                     {/* ── STEP 2: LOCATION ── */}
//                     {currentStep === 2 && (
//                       <div className="space-y-4">
//                         <SectionHeader
//                           icon={MapPin}
//                           title="Location & Operations"
//                           subtitle="Used for search visibility & member discovery."
//                         />

//                         <Field label="Address Line *">
//                           <Input
//                             value={form.addressLine}
//                             onChange={set("addressLine")}
//                             placeholder="123 Fitness Avenue"
//                             className={inputStyle}
//                           />
//                         </Field>

//                         <div className="grid grid-cols-3 gap-3">
//                           <Field label="City *">
//                             <Input
//                               value={form.city}
//                               onChange={set("city")}
//                               placeholder="Lahore"
//                               className={inputStyle}
//                             />
//                           </Field>
//                           <Field label="Province">
//                             <Input
//                               value={form.province}
//                               onChange={set("province")}
//                               placeholder="Punjab"
//                               className={inputStyle}
//                             />
//                           </Field>
//                           <Field label="Postal Code">
//                             <Input
//                               value={form.postalCode}
//                               onChange={set("postalCode")}
//                               placeholder="54000"
//                               className={inputStyle}
//                             />
//                           </Field>
//                         </div>

//                         {/* LIVE COORDINATES BOX */}
//                         <div className="rounded-[22px] border border-[#E5DACE] bg-[#F7F1E8] p-4">
//                           <div className="flex items-center justify-between">
//                             <div>
//                               <h3 className="text-[15px] font-semibold text-[#17120E]">
//                                 Live Coordinates
//                               </h3>
//                               <p className="text-xs text-[#756B63] mt-0.5">
//                                 Auto detect exact gym location.
//                               </p>
//                             </div>
//                             <Button
//                               onClick={fetchLocation}
//                               disabled={fetchingLocation}
//                               className="h-9 px-4 rounded-xl bg-[#2A1608] hover:bg-[#1C0F06] text-sm"
//                             >
//                               {fetchingLocation ? (
//                                 <>
//                                   <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
//                                   Fetching
//                                 </>
//                               ) : (
//                                 <>
//                                   <Navigation className="w-3.5 h-3.5 mr-1.5" />
//                                   Fetch Location
//                                 </>
//                               )}
//                             </Button>
//                           </div>
//                           <div className="grid grid-cols-2 gap-3 mt-3">
//                             <Field label="Latitude *">
//                               <Input
//                                 value={form.latitude}
//                                 onChange={set("latitude")}
//                                 placeholder="31.520370"
//                                 className={inputStyle}
//                               />
//                             </Field>
//                             <Field label="Longitude *">
//                               <Input
//                                 value={form.longitude}
//                                 onChange={set("longitude")}
//                                 placeholder="74.358749"
//                                 className={inputStyle}
//                               />
//                             </Field>
//                           </div>
//                         </div>

//                         <div className="grid grid-cols-2 gap-3">
//                           <Field label="Opening Time">
//                             <Input
//                               type="time"
//                               value={form.openingTime}
//                               onChange={set("openingTime")}
//                               disabled={form.is24Hours}
//                               className={inputStyle}
//                             />
//                           </Field>
//                           <Field label="Closing Time">
//                             <Input
//                               type="time"
//                               value={form.closingTime}
//                               onChange={set("closingTime")}
//                               disabled={form.is24Hours}
//                               className={inputStyle}
//                             />
//                           </Field>
//                         </div>

//                         <div className="flex items-center justify-between rounded-2xl border border-[#E5DACE] bg-[#F8F3EC] px-4 py-3">
//                           <div>
//                             <h4 className="font-semibold text-[#1A120D] text-sm">
//                               Open 24 Hours
//                             </h4>
//                             <p className="text-xs text-[#756C64]">
//                               Enable for 24/7 gyms
//                             </p>
//                           </div>
//                           <Switch
//                             checked={form.is24Hours}
//                             onCheckedChange={(value) =>
//                               setForm((prev) => ({ ...prev, is24Hours: value }))
//                             }
//                           />
//                         </div>
//                       </div>
//                     )}

//                     {/* ── STEP 3: MEDIA ── */}
//                     {currentStep === 3 && (
//                       <div className="space-y-4">
//                         <SectionHeader
//                           icon={Globe2}
//                           title="Media & Verification"
//                           subtitle="Upload branding assets and verification documents."
//                         />

//                         <UploadCard
//                           title="Cover Image"
//                           subtitle="Main public gym image"
//                           onChange={(e) => setCoverImage(e.target.files[0])}
//                           file={coverImage}
//                         />

//                         <UploadCard
//                           title="Gallery Photos"
//                           subtitle="Gym environment photos (multiple)"
//                           multiple
//                           onChange={(e) =>
//                             setPhotos(Array.from(e.target.files))
//                           }
//                           file={
//                             photos.length > 0
//                               ? `${photos.length} file(s) selected`
//                               : null
//                           }
//                         />

//                         <div className="grid grid-cols-2 gap-3">
//                           <UploadMini
//                             title="Owner CNIC"
//                             onChange={(e) => setOwnerCnic(e.target.files[0])}
//                             file={ownerCnic}
//                           />
//                           <UploadMini
//                             title="Business License"
//                             onChange={(e) =>
//                               setBusinessLicense(e.target.files[0])
//                             }
//                             file={businessLicense}
//                           />
//                           <UploadMini
//                             title="Ownership Proof"
//                             onChange={(e) =>
//                               setOwnershipProof(e.target.files[0])
//                             }
//                             file={ownershipProof}
//                           />
//                           <UploadMini
//                             title="Utility Bill"
//                             onChange={(e) => setUtilityBill(e.target.files[0])}
//                             file={utilityBill}
//                           />
//                         </div>
//                       </div>
//                     )}

//                     {/* ── STEP 4: REVIEW ── */}
//                     {currentStep === 4 && (
//                       <div className="space-y-4">
//                         <SectionHeader
//                           icon={FileText}
//                           title="Review Submission"
//                           subtitle="Final overview before submission."
//                         />

//                         <div className="grid grid-cols-2 gap-3">
//                           <ReviewCard title="Gym Name" value={form.name} />
//                           <ReviewCard
//                             title="Business Name"
//                             value={form.businessName}
//                           />
//                           <ReviewCard title="City" value={form.city} />
//                           <ReviewCard title="Province" value={form.province} />
//                           <ReviewCard
//                             title="Address"
//                             value={form.addressLine}
//                           />
//                           <ReviewCard
//                             title="Postal Code"
//                             value={form.postalCode}
//                           />
//                           <ReviewCard title="Phone" value={form.phoneNumber} />
//                           <ReviewCard
//                             title="WhatsApp"
//                             value={form.whatsappNumber}
//                           />
//                           <ReviewCard
//                             title="Coordinates"
//                             value={
//                               form.latitude && form.longitude
//                                 ? `${form.latitude}, ${form.longitude}`
//                                 : ""
//                             }
//                           />
//                           <ReviewCard
//                             title="24 Hours"
//                             value={form.is24Hours ? "Enabled" : "Disabled"}
//                           />
//                           {!form.is24Hours && (
//                             <>
//                               <ReviewCard
//                                 title="Opening Time"
//                                 value={form.openingTime}
//                               />
//                               <ReviewCard
//                                 title="Closing Time"
//                                 value={form.closingTime}
//                               />
//                             </>
//                           )}
//                           <ReviewCard
//                             title="Instagram"
//                             value={form.instagramHandle}
//                           />
//                           <ReviewCard title="Website" value={form.websiteUrl} />
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* FIX 5: Footer is flex-shrink-0, always visible at bottom */}
//                   <div className="flex-shrink-0 px-5 py-3 border-t border-[#E9DED1] flex items-center justify-between bg-[#FBF9F6] rounded-b-[28px]">
//                     <Button
//                       variant="ghost"
//                       className="h-10 px-4 rounded-xl text-[#6A5E55] text-sm"
//                     >
//                       Cancel
//                     </Button>

//                     <div className="flex items-center gap-2">
//                       {currentStep > 1 && (
//                         <Button
//                           variant="outline"
//                           onClick={previousStep}
//                           className="h-10 rounded-xl text-sm"
//                         >
//                           <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
//                           Back
//                         </Button>
//                       )}

//                       {currentStep < 4 ? (
//                         <Button
//                           onClick={nextStep}
//                           className="h-10 px-5 rounded-xl bg-[#2A1608] hover:bg-[#1C0F06] text-sm"
//                         >
//                           Continue
//                           <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
//                         </Button>
//                       ) : (
//                         <Button
//                           disabled={isLoading}
//                           onClick={handleSubmit}
//                           className="h-10 px-5 rounded-xl bg-[#2A1608] hover:bg-[#1C0F06] text-sm"
//                         >
//                           {isLoading ? (
//                             <>
//                               <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
//                               Submitting
//                             </>
//                           ) : (
//                             <>
//                               Submit Registration
//                               <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
//                             </>
//                           )}
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* ── RIGHT SIDEBAR ── FIX 6: also flex-col + overflow-y-auto inside */}
//                 <div className="flex flex-col gap-3 overflow-y-auto">
//                   <div className="rounded-[24px] bg-[#2B1206] p-5 text-white flex-shrink-0">
//                     <h3 className="text-[16px] font-bold">Registration Tips</h3>
//                     <div className="mt-4 space-y-4">
//                       <Tip text="Use high-resolution professional facility photos." />
//                       <Tip text="Ensure documents match business information." />
//                       <Tip text="Location accuracy improves member visibility." />
//                     </div>
//                   </div>

//                   <div className="rounded-[22px] border border-[#E5DACE] bg-[#F6EFE7] p-5 flex-shrink-0">
//                     <p className="text-[10px] uppercase tracking-[0.2em] text-[#75695F]">
//                       Draft Progress
//                     </p>
//                     <div className="mt-3 h-1.5 rounded-full bg-[#E5D9CD] overflow-hidden">
//                       <div
//                         className="h-full bg-[#9A5A17] transition-all duration-500"
//                         style={{
//                           width: `${(currentStep / steps.length) * 100}%`,
//                         }}
//                       />
//                     </div>
//                     <p className="mt-3 text-sm text-[#5F5349] font-medium">
//                       {Math.round((currentStep / steps.length) * 100)}% Complete
//                     </p>
//                     <p className="mt-1 text-xs text-[#8A7E75]">
//                       Step {currentStep} of {steps.length}
//                     </p>
//                   </div>

//                   {/* Step-specific hint card */}
//                   <div className="rounded-[22px] border border-[#E5DACE] bg-[#FBF9F6] p-4 flex-shrink-0">
//                     <p className="text-[10px] uppercase tracking-[0.2em] text-[#75695F] mb-2">
//                       Current Step
//                     </p>
//                     {currentStep === 1 && (
//                       <p className="text-[13px] text-[#4A3F38]">
//                         Fill in your gym's public-facing details. Only Facility
//                         Name is required to proceed.
//                       </p>
//                     )}
//                     {currentStep === 2 && (
//                       <p className="text-[13px] text-[#4A3F38]">
//                         Address, City, Latitude & Longitude are required. Use
//                         "Fetch Location" for accuracy.
//                       </p>
//                     )}
//                     {currentStep === 3 && (
//                       <p className="text-[13px] text-[#4A3F38]">
//                         All uploads are optional but improve approval speed.
//                         Accepted: images & PDFs.
//                       </p>
//                     )}
//                     {currentStep === 4 && (
//                       <p className="text-[13px] text-[#4A3F38]">
//                         Review all details carefully. Once submitted, your gym
//                         enters admin review queue.
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </OwnerLayout>
//   );
// }

// /* ── STYLES ── */

// const inputStyle = `
//   h-10 rounded-xl
//   border-[#E3D8CB]
//   bg-[#F3EDE4]
//   text-[14px]
//   shadow-none
//   focus-visible:ring-2
//   focus-visible:ring-[#9A5A17]/20
// `;

// const textareaStyle = `
//   rounded-xl
//   border-[#E3D8CB]
//   bg-[#F3EDE4]
//   text-[14px]
//   resize-none
//   shadow-none
//   focus-visible:ring-2
//   focus-visible:ring-[#9A5A17]/20
// `;

// /* ── HELPERS ── */

// function SectionHeader({ icon: Icon, title, subtitle }) {
//   return (
//     <div className="flex items-center gap-3">
//       <div className="w-10 h-10 rounded-xl bg-[#F1E3D1] flex items-center justify-center flex-shrink-0">
//         <Icon className="w-4.5 h-4.5 text-[#8A4F18]" />
//       </div>
//       <div>
//         <h3 className="text-[20px] font-bold text-[#17120D] leading-tight">
//           {title}
//         </h3>
//         <p className="text-[12px] text-[#6E635B]">{subtitle}</p>
//       </div>
//     </div>
//   );
// }

// function Field({ label, children }) {
//   return (
//     <div className="space-y-1.5">
//       <Label className="text-[10px] uppercase tracking-[0.18em] text-[#746960]">
//         {label}
//       </Label>
//       {children}
//     </div>
//   );
// }

// function Tip({ text }) {
//   return (
//     <div className="flex items-start gap-2.5">
//       <div className="w-4.5 h-4.5 rounded-full border border-[#D8A66A] flex items-center justify-center mt-0.5 flex-shrink-0">
//         <Check className="w-2.5 h-2.5 text-[#D8A66A]" />
//       </div>
//       <p className="text-[13px] leading-relaxed text-white/80">{text}</p>
//     </div>
//   );
// }

// function ReviewCard({ title, value }) {
//   return (
//     <div className="rounded-xl border border-[#E5DACE] bg-[#F8F2EA] p-4">
//       <p className="text-[10px] uppercase tracking-[0.18em] text-[#7B6F65]">
//         {title}
//       </p>
//       <p className="mt-2 text-[14px] font-semibold text-[#1B120D] break-words">
//         {value || "—"}
//       </p>
//     </div>
//   );
// }

// function UploadCard({ title, subtitle, multiple, onChange, file }) {
//   return (
//     <div className="rounded-[22px] border-2 border-dashed border-[#C9833A] bg-[#F7F1E8] p-5 flex items-center justify-between gap-4">
//       <div className="flex items-center gap-3">
//         <div className="w-12 h-12 rounded-full bg-[#EEDBC7] flex items-center justify-center flex-shrink-0">
//           <UploadCloud className="w-5 h-5 text-[#9A5A17]" />
//         </div>
//         <div>
//           <h4 className="text-[15px] font-semibold text-[#17120D]">{title}</h4>
//           <p className="text-xs text-[#71665D] mt-0.5">
//             {file ? (typeof file === "string" ? file : file.name) : subtitle}
//           </p>
//         </div>
//       </div>
//       <label className="flex-shrink-0">
//         <input
//           hidden
//           type="file"
//           multiple={multiple}
//           accept="image/*,.pdf"
//           onChange={onChange}
//         />
//         <div className="h-9 px-4 rounded-xl border border-[#B6773E] bg-white flex items-center justify-center cursor-pointer text-[#7A4816] font-medium text-sm whitespace-nowrap">
//           {file ? "Change" : "Browse"}
//         </div>
//       </label>
//     </div>
//   );
// }

// function UploadMini({ title, onChange, file }) {
//   return (
//     <label className="rounded-xl border border-[#E5DACE] bg-[#F8F2EA] p-3.5 cursor-pointer block">
//       <input hidden type="file" accept="image/*,.pdf" onChange={onChange} />
//       <div className="flex items-center gap-2.5">
//         <div
//           className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${file ? "bg-[#C9E8C9]" : "bg-[#EEDBC7]"}`}
//         >
//           {file ? (
//             <Check className="w-4 h-4 text-green-700" />
//           ) : (
//             <UploadCloud className="w-4 h-4 text-[#9A5A17]" />
//           )}
//         </div>
//         <div className="min-w-0">
//           <p className="font-semibold text-[#1B120D] text-[13px]">{title}</p>
//           <p className="text-xs text-[#72665D] truncate">
//             {file
//               ? typeof file === "string"
//                 ? file
//                 : file.name
//               : "Upload file"}
//           </p>
//         </div>
//       </div>
//     </label>
//   );
// }

/* =========================================================
   PROFESSIONAL ENTERPRISE REGISTER GYM
   FIXED: viewport height, scrolling, all fields visible
   MODIFIED: tier removed (admin-assigned), phone/CNIC formatters added
========================================================= */

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Navigation,
  UploadCloud,
  MapPin,
  Building2,
  Phone,
  Clock3,
  FileText,
  Globe2,
} from "lucide-react";

import OwnerLayout from "@/components/layouts/OwnerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { useToast } from "@/hooks/use-toast";
import { gymService } from "@/services/gymService";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterGym() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateGymId } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  /* FILE STATES */
  const [coverImage, setCoverImage] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [ownerCnic, setOwnerCnic] = useState(null);
  const [businessLicense, setBusinessLicense] = useState(null);
  const [ownershipProof, setOwnershipProof] = useState(null);
  const [utilityBill, setUtilityBill] = useState(null);

  /* FORM STATE — tier removed (admin assigns after review) */
  const [form, setForm] = useState({
    name: "",
    description: "",
    addressLine: "",
    city: "",
    province: "",
    postalCode: "",
    latitude: "",
    longitude: "",
    phoneNumber: "+92",
    whatsappNumber: "+92",
    instagramHandle: "",
    websiteUrl: "",
    googleMapsLink: "",
    cnicNumber: "",
    businessName: "",
    openingTime: "",
    closingTime: "",
    is24Hours: false,
  });

  const steps = useMemo(
    () => [
      { id: 1, title: "Gym Info" },
      { id: 2, title: "Location" },
      { id: 3, title: "Media" },
      { id: 4, title: "Review" },
    ],
    [],
  );

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  /* PHONE & CNIC FORMATTERS */
  const formatPakistanPhone = (value) => {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.startsWith("92")) cleaned = cleaned.slice(2);
    cleaned = cleaned.slice(0, 10);
    return `+92${cleaned}`;
  };

  const handlePhoneChange = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: formatPakistanPhone(e.target.value),
    }));

  const formatCNIC = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 13);
    if (cleaned.length <= 5) return cleaned;
    if (cleaned.length <= 12)
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12, 13)}`;
  };

  const handleCNICChange = (e) =>
    setForm((prev) => ({ ...prev, cnicNumber: formatCNIC(e.target.value) }));

  /* VALIDATION */
  const validateStep = () => {
    if (currentStep === 1) {
      if (!form.name.trim()) {
        toast({ title: "Gym name required", variant: "destructive" });
        return false;
      }
      const phoneRegex = /^\+92\d{10}$/;
      if (form.phoneNumber && !phoneRegex.test(form.phoneNumber)) {
        toast({
          title: "Invalid phone number. Use +92XXXXXXXXXX",
          variant: "destructive",
        });
        return false;
      }
      if (form.whatsappNumber && !phoneRegex.test(form.whatsappNumber)) {
        toast({
          title: "Invalid WhatsApp number. Use +92XXXXXXXXXX",
          variant: "destructive",
        });
        return false;
      }
      const cnicRegex = /^\d{5}-\d{7}-\d$/;
      if (form.cnicNumber && !cnicRegex.test(form.cnicNumber)) {
        toast({
          title: "Invalid CNIC. Format: 34101-1234567-1",
          variant: "destructive",
        });
        return false;
      }
    }
    if (currentStep === 2) {
      if (!form.addressLine.trim() || !form.city.trim()) {
        toast({
          title: "Address and city are required",
          variant: "destructive",
        });
        return false;
      }
      if (!form.latitude || isNaN(Number(form.latitude))) {
        toast({ title: "Valid latitude required", variant: "destructive" });
        return false;
      }
      if (!form.longitude || isNaN(Number(form.longitude))) {
        toast({ title: "Valid longitude required", variant: "destructive" });
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    if (currentStep < 4) setCurrentStep((p) => p + 1);
  };

  const previousStep = () => {
    if (currentStep > 1) setCurrentStep((p) => p - 1);
  };

  /* FETCH LAT LONG */
  const fetchLocation = async () => {
    try {
      setFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(7),
            longitude: position.coords.longitude.toFixed(7),
          }));
          toast({
            title: "Location fetched",
            description: "Coordinates detected successfully",
          });
          setFetchingLocation(false);
        },
        () => {
          toast({
            title: "Location permission denied",
            variant: "destructive",
          });
          setFetchingLocation(false);
        },
      );
    } catch {
      setFetchingLocation(false);
    }
  };

  /* SUBMIT — tier removed, sent as null (admin assigns after review) */
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const body = new FormData();
      body.append("name", form.name);
      body.append("description", form.description || "");
      body.append("addressLine", form.addressLine);
      body.append("city", form.city);
      body.append("province", form.province || "");
      body.append("postalCode", form.postalCode || "");
      body.append("latitude", form.latitude);
      body.append("longitude", form.longitude);
      body.append("phoneNumber", form.phoneNumber);
      body.append("whatsappNumber", form.whatsappNumber);
      body.append("instagramHandle", form.instagramHandle || "");
      body.append("websiteUrl", form.websiteUrl || "");
      body.append("googleMapsLink", form.googleMapsLink || "");
      body.append("cnicNumber", form.cnicNumber || "");
      body.append("businessName", form.businessName || "");
      body.append("openingTime", form.openingTime || "");
      body.append("closingTime", form.closingTime || "");
      body.append("is24Hours", form.is24Hours ? "true" : "false");
      // tier REMOVED — admin assigns after facility assessment

      if (coverImage) body.append("coverImage", coverImage);
      photos.forEach((photo) => body.append("photos", photo));
      if (ownerCnic) body.append("ownerCnic", ownerCnic);
      if (businessLicense) body.append("businessLicense", businessLicense);
      if (ownershipProof) body.append("ownershipProof", ownershipProof);
      if (utilityBill) body.append("utilityBill", utilityBill);

      const data = await gymService.registerGym(body);
      if (!data.success) throw new Error(data.message);
      if (data.gym?.id) updateGymId(data.gym.id);

      toast({
        title: "Gym Registered",
        description:
          "Your gym is pending admin approval. Tier will be assigned after facility assessment.",
      });
      navigate("/dashboard/owner/my-gym");
    } catch (err) {
      toast({
        title: "Registration failed",
        description: err?.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OwnerLayout active="my-gym">
      <div className="flex flex-col h-[calc(100vh-72px)] bg-[#F5F0E8] overflow-hidden">
        {/* ── TOP HEADER ── */}
        <div className="flex-shrink-0 h-14 border-b border-[#E5DCCF] bg-[#F7F2EA] px-6 flex items-center justify-between">
          <h1 className="text-[17px] font-bold text-[#17120E]">
            GymKey Enterprise
          </h1>
          <div className="flex items-center gap-4">
            <button className="text-sm text-[#6B625A]">Support Portal</button>
            <div className="w-9 h-9 rounded-full bg-[#2A1608]" />
          </div>
        </div>

        {/* ── MAIN AREA ── */}
        <div className="flex-1 overflow-hidden px-6 py-4">
          <div className="h-full max-w-[1500px] mx-auto flex flex-col gap-3">
            {/* ── PAGE HEADER + STEPS ── */}
            <div className="flex-shrink-0 flex items-center justify-between">
              <div>
                <h2 className="text-[28px] leading-tight font-bold text-[#17120E] tracking-[-0.03em]">
                  Register New Facility
                </h2>
                <p className="mt-0.5 text-[13px] text-[#655B53]">
                  Onboard your gym into GymKey operational infrastructure.
                </p>
              </div>

              {/* STEPS */}
              <div className="flex items-center gap-3">
                {steps.map((step, index) => {
                  const active = currentStep === step.id;
                  const completed = currentStep > step.id;
                  return (
                    <div key={step.id} className="flex items-center gap-2">
                      <div
                        className={`
                          w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                          ${active ? "bg-[#9A5A17] text-white shadow-lg" : completed ? "bg-[#2A1608] text-white" : "bg-[#E5DCCF] text-[#786E65]"}
                        `}
                      >
                        {completed ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <span
                        className={`text-[13px] font-medium whitespace-nowrap ${active ? "text-[#1A120D]" : "text-[#7B6F65]"}`}
                      >
                        {step.title}
                      </span>
                      {index !== steps.length - 1 && (
                        <div className="w-7 h-px bg-[#D9CEC1]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── BODY ── */}
            <div className="flex-1 overflow-hidden">
              <div className="grid grid-cols-[1fr_300px] gap-4 h-full">
                {/* ── LEFT PANEL ── */}
                <div className="bg-[#FBF9F6] border border-[#E9DED1] rounded-[28px] flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-5 pr-4 space-y-4">
                    {/* ── STEP 1: GYM INFO ── */}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <SectionHeader
                          icon={Building2}
                          title="Core Details"
                          subtitle="Business identity & public information."
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Facility Name *">
                            <Input
                              value={form.name}
                              onChange={set("name")}
                              placeholder="Summit Performance Club"
                              className={inputStyle}
                            />
                          </Field>
                          <Field label="Business Name">
                            <Input
                              value={form.businessName}
                              onChange={set("businessName")}
                              placeholder="Titan Fitness Pvt Ltd"
                              className={inputStyle}
                            />
                          </Field>
                        </div>

                        <Field label="Facility Description">
                          <Textarea
                            rows={3}
                            value={form.description}
                            onChange={set("description")}
                            placeholder="Describe your gym atmosphere, equipment & services..."
                            className={textareaStyle}
                          />
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Phone Number">
                            <Input
                              value={form.phoneNumber}
                              onChange={handlePhoneChange("phoneNumber")}
                              placeholder="+923001234567"
                              className={inputStyle}
                            />
                          </Field>
                          <Field label="WhatsApp Number">
                            <Input
                              value={form.whatsappNumber}
                              onChange={handlePhoneChange("whatsappNumber")}
                              placeholder="+923001234567"
                              className={inputStyle}
                            />
                          </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Field label="CNIC Number">
                            <Input
                              value={form.cnicNumber}
                              onChange={handleCNICChange}
                              placeholder="34101-1234567-1"
                              className={inputStyle}
                            />
                          </Field>
                          <Field label="Google Maps Link">
                            <Input
                              value={form.googleMapsLink}
                              onChange={set("googleMapsLink")}
                              placeholder="https://maps.google.com/..."
                              className={inputStyle}
                            />
                          </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Instagram">
                            <Input
                              value={form.instagramHandle}
                              onChange={set("instagramHandle")}
                              placeholder="@gym"
                              className={inputStyle}
                            />
                          </Field>
                          <Field label="Website URL">
                            <Input
                              value={form.websiteUrl}
                              onChange={set("websiteUrl")}
                              placeholder="https://gym.com"
                              className={inputStyle}
                            />
                          </Field>
                        </div>
                      </div>
                    )}

                    {/* ── STEP 2: LOCATION ── */}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <SectionHeader
                          icon={MapPin}
                          title="Location & Operations"
                          subtitle="Used for search visibility & member discovery."
                        />

                        <Field label="Address Line *">
                          <Input
                            value={form.addressLine}
                            onChange={set("addressLine")}
                            placeholder="123 Fitness Avenue"
                            className={inputStyle}
                          />
                        </Field>

                        <div className="grid grid-cols-3 gap-3">
                          <Field label="City *">
                            <Input
                              value={form.city}
                              onChange={set("city")}
                              placeholder="Lahore"
                              className={inputStyle}
                            />
                          </Field>
                          <Field label="Province">
                            <Input
                              value={form.province}
                              onChange={set("province")}
                              placeholder="Punjab"
                              className={inputStyle}
                            />
                          </Field>
                          <Field label="Postal Code">
                            <Input
                              value={form.postalCode}
                              onChange={set("postalCode")}
                              placeholder="54000"
                              className={inputStyle}
                            />
                          </Field>
                        </div>

                        {/* LIVE COORDINATES BOX */}
                        <div className="rounded-[22px] border border-[#E5DACE] bg-[#F7F1E8] p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-[15px] font-semibold text-[#17120E]">
                                Live Coordinates
                              </h3>
                              <p className="text-xs text-[#756B63] mt-0.5">
                                Auto detect exact gym location.
                              </p>
                            </div>
                            <Button
                              onClick={fetchLocation}
                              disabled={fetchingLocation}
                              className="h-9 px-4 rounded-xl bg-[#2A1608] hover:bg-[#1C0F06] text-sm"
                            >
                              {fetchingLocation ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                                  Fetching
                                </>
                              ) : (
                                <>
                                  <Navigation className="w-3.5 h-3.5 mr-1.5" />
                                  Fetch Location
                                </>
                              )}
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-3">
                            <Field label="Latitude *">
                              <Input
                                value={form.latitude}
                                onChange={set("latitude")}
                                placeholder="31.520370"
                                className={inputStyle}
                              />
                            </Field>
                            <Field label="Longitude *">
                              <Input
                                value={form.longitude}
                                onChange={set("longitude")}
                                placeholder="74.358749"
                                className={inputStyle}
                              />
                            </Field>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Opening Time">
                            <Input
                              type="time"
                              value={form.openingTime}
                              onChange={set("openingTime")}
                              disabled={form.is24Hours}
                              className={inputStyle}
                            />
                          </Field>
                          <Field label="Closing Time">
                            <Input
                              type="time"
                              value={form.closingTime}
                              onChange={set("closingTime")}
                              disabled={form.is24Hours}
                              className={inputStyle}
                            />
                          </Field>
                        </div>

                        <div className="flex items-center justify-between rounded-2xl border border-[#E5DACE] bg-[#F8F3EC] px-4 py-3">
                          <div>
                            <h4 className="font-semibold text-[#1A120D] text-sm">
                              Open 24 Hours
                            </h4>
                            <p className="text-xs text-[#756C64]">
                              Enable for 24/7 gyms
                            </p>
                          </div>
                          <Switch
                            checked={form.is24Hours}
                            onCheckedChange={(value) =>
                              setForm((prev) => ({ ...prev, is24Hours: value }))
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* ── STEP 3: MEDIA ── */}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <SectionHeader
                          icon={Globe2}
                          title="Media & Verification"
                          subtitle="Upload branding assets and verification documents."
                        />

                        <UploadCard
                          title="Cover Image"
                          subtitle="Main public gym image"
                          onChange={(e) => setCoverImage(e.target.files[0])}
                          file={coverImage}
                        />

                        <UploadCard
                          title="Gallery Photos"
                          subtitle="Gym environment photos (multiple)"
                          multiple
                          onChange={(e) =>
                            setPhotos(Array.from(e.target.files))
                          }
                          file={
                            photos.length > 0
                              ? `${photos.length} file(s) selected`
                              : null
                          }
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <UploadMini
                            title="Owner CNIC"
                            onChange={(e) => setOwnerCnic(e.target.files[0])}
                            file={ownerCnic}
                          />
                          <UploadMini
                            title="Business License"
                            onChange={(e) =>
                              setBusinessLicense(e.target.files[0])
                            }
                            file={businessLicense}
                          />
                          <UploadMini
                            title="Ownership Proof"
                            onChange={(e) =>
                              setOwnershipProof(e.target.files[0])
                            }
                            file={ownershipProof}
                          />
                          <UploadMini
                            title="Utility Bill"
                            onChange={(e) => setUtilityBill(e.target.files[0])}
                            file={utilityBill}
                          />
                        </div>
                      </div>
                    )}

                    {/* ── STEP 4: REVIEW ── */}
                    {currentStep === 4 && (
                      <div className="space-y-4">
                        <SectionHeader
                          icon={FileText}
                          title="Review Submission"
                          subtitle="Final overview before submission."
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <ReviewCard title="Gym Name" value={form.name} />
                          <ReviewCard
                            title="Business Name"
                            value={form.businessName}
                          />
                          <ReviewCard title="City" value={form.city} />
                          <ReviewCard title="Province" value={form.province} />
                          <ReviewCard
                            title="Address"
                            value={form.addressLine}
                          />
                          <ReviewCard
                            title="Postal Code"
                            value={form.postalCode}
                          />
                          <ReviewCard title="Phone" value={form.phoneNumber} />
                          <ReviewCard
                            title="WhatsApp"
                            value={form.whatsappNumber}
                          />
                          <ReviewCard
                            title="Coordinates"
                            value={
                              form.latitude && form.longitude
                                ? `${form.latitude}, ${form.longitude}`
                                : ""
                            }
                          />
                          <ReviewCard
                            title="24 Hours"
                            value={form.is24Hours ? "Enabled" : "Disabled"}
                          />
                          {!form.is24Hours && (
                            <>
                              <ReviewCard
                                title="Opening Time"
                                value={form.openingTime}
                              />
                              <ReviewCard
                                title="Closing Time"
                                value={form.closingTime}
                              />
                            </>
                          )}
                          <ReviewCard
                            title="Instagram"
                            value={form.instagramHandle}
                          />
                          <ReviewCard title="Website" value={form.websiteUrl} />
                          <ReviewCard title="CNIC" value={form.cnicNumber} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="flex-shrink-0 px-5 py-3 border-t border-[#E9DED1] flex items-center justify-between bg-[#FBF9F6] rounded-b-[28px]">
                    <Button
                      variant="ghost"
                      className="h-10 px-4 rounded-xl text-[#6A5E55] text-sm"
                    >
                      Cancel
                    </Button>

                    <div className="flex items-center gap-2">
                      {currentStep > 1 && (
                        <Button
                          variant="outline"
                          onClick={previousStep}
                          className="h-10 rounded-xl text-sm"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                          Back
                        </Button>
                      )}

                      {currentStep < 4 ? (
                        <Button
                          onClick={nextStep}
                          className="h-10 px-5 rounded-xl bg-[#2A1608] hover:bg-[#1C0F06] text-sm"
                        >
                          Continue
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      ) : (
                        <Button
                          disabled={isLoading}
                          onClick={handleSubmit}
                          className="h-10 px-5 rounded-xl bg-[#2A1608] hover:bg-[#1C0F06] text-sm"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                              Submitting
                            </>
                          ) : (
                            <>
                              Submit Registration
                              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── RIGHT SIDEBAR ── */}
                <div className="flex flex-col gap-3 overflow-y-auto">
                  <div className="rounded-[24px] bg-[#2B1206] p-5 text-white flex-shrink-0">
                    <h3 className="text-[16px] font-bold">Registration Tips</h3>
                    <div className="mt-4 space-y-4">
                      <Tip text="Use high-resolution professional facility photos." />
                      <Tip text="Ensure documents match business information." />
                      <Tip text="Location accuracy improves member visibility." />
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-[#E5DACE] bg-[#F6EFE7] p-5 flex-shrink-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#75695F]">
                      Draft Progress
                    </p>
                    <div className="mt-3 h-1.5 rounded-full bg-[#E5D9CD] overflow-hidden">
                      <div
                        className="h-full bg-[#9A5A17] transition-all duration-500"
                        style={{
                          width: `${(currentStep / steps.length) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="mt-3 text-sm text-[#5F5349] font-medium">
                      {Math.round((currentStep / steps.length) * 100)}% Complete
                    </p>
                    <p className="mt-1 text-xs text-[#8A7E75]">
                      Step {currentStep} of {steps.length}
                    </p>
                  </div>

                  {/* Step-specific hint card */}
                  <div className="rounded-[22px] border border-[#E5DACE] bg-[#FBF9F6] p-4 flex-shrink-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#75695F] mb-2">
                      Current Step
                    </p>
                    {currentStep === 1 && (
                      <p className="text-[13px] text-[#4A3F38]">
                        Fill in your gym's public-facing details. Only Facility
                        Name is required to proceed.
                      </p>
                    )}
                    {currentStep === 2 && (
                      <p className="text-[13px] text-[#4A3F38]">
                        Address, City, Latitude & Longitude are required. Use
                        "Fetch Location" for accuracy.
                      </p>
                    )}
                    {currentStep === 3 && (
                      <p className="text-[13px] text-[#4A3F38]">
                        All uploads are optional but improve approval speed.
                        Accepted: images & PDFs.
                      </p>
                    )}
                    {currentStep === 4 && (
                      <p className="text-[13px] text-[#4A3F38]">
                        Review all details carefully. Once submitted, your gym
                        enters admin review queue. Admin will assign tier after
                        facility assessment.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}

/* ── STYLES ── */

const inputStyle = `
  h-10 rounded-xl
  border-[#E3D8CB]
  bg-[#F3EDE4]
  text-[14px]
  shadow-none
  focus-visible:ring-2
  focus-visible:ring-[#9A5A17]/20
`;

const textareaStyle = `
  rounded-xl
  border-[#E3D8CB]
  bg-[#F3EDE4]
  text-[14px]
  resize-none
  shadow-none
  focus-visible:ring-2
  focus-visible:ring-[#9A5A17]/20
`;

/* ── HELPERS ── */

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-[#F1E3D1] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4.5 h-4.5 text-[#8A4F18]" />
      </div>
      <div>
        <h3 className="text-[20px] font-bold text-[#17120D] leading-tight">
          {title}
        </h3>
        <p className="text-[12px] text-[#6E635B]">{subtitle}</p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase tracking-[0.18em] text-[#746960]">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Tip({ text }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-4.5 h-4.5 rounded-full border border-[#D8A66A] flex items-center justify-center mt-0.5 flex-shrink-0">
        <Check className="w-2.5 h-2.5 text-[#D8A66A]" />
      </div>
      <p className="text-[13px] leading-relaxed text-white/80">{text}</p>
    </div>
  );
}

function ReviewCard({ title, value }) {
  return (
    <div className="rounded-xl border border-[#E5DACE] bg-[#F8F2EA] p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[#7B6F65]">
        {title}
      </p>
      <p className="mt-2 text-[14px] font-semibold text-[#1B120D] break-words">
        {value || "—"}
      </p>
    </div>
  );
}

function UploadCard({ title, subtitle, multiple, onChange, file }) {
  return (
    <div className="rounded-[22px] border-2 border-dashed border-[#C9833A] bg-[#F7F1E8] p-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#EEDBC7] flex items-center justify-center flex-shrink-0">
          <UploadCloud className="w-5 h-5 text-[#9A5A17]" />
        </div>
        <div>
          <h4 className="text-[15px] font-semibold text-[#17120D]">{title}</h4>
          <p className="text-xs text-[#71665D] mt-0.5">
            {file ? (typeof file === "string" ? file : file.name) : subtitle}
          </p>
        </div>
      </div>
      <label className="flex-shrink-0">
        <input
          hidden
          type="file"
          multiple={multiple}
          accept="image/*,.pdf"
          onChange={onChange}
        />
        <div className="h-9 px-4 rounded-xl border border-[#B6773E] bg-white flex items-center justify-center cursor-pointer text-[#7A4816] font-medium text-sm whitespace-nowrap">
          {file ? "Change" : "Browse"}
        </div>
      </label>
    </div>
  );
}

function UploadMini({ title, onChange, file }) {
  return (
    <label className="rounded-xl border border-[#E5DACE] bg-[#F8F2EA] p-3.5 cursor-pointer block">
      <input hidden type="file" accept="image/*,.pdf" onChange={onChange} />
      <div className="flex items-center gap-2.5">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${file ? "bg-[#C9E8C9]" : "bg-[#EEDBC7]"}`}
        >
          {file ? (
            <Check className="w-4 h-4 text-green-700" />
          ) : (
            <UploadCloud className="w-4 h-4 text-[#9A5A17]" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-[#1B120D] text-[13px]">{title}</p>
          <p className="text-xs text-[#72665D] truncate">
            {file
              ? typeof file === "string"
                ? file
                : file.name
              : "Upload file"}
          </p>
        </div>
      </div>
    </label>
  );
}
