import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { Camera, MapPin, Upload, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/UserContext";
import { API_BASE } from "@/UserContext";
import { findNearbyDuplicate, osmLink, WasteReport } from "@/lib/store";

const oldItemPoints: Record<string, number> = {
  newspaperBundle: 30,
  oilCans: 20,
  lamps: 60,
  smallElectricalWires: 50,
  // large appliance points handled dynamically
};

const ReportWaste = () => {
  const { currentUser } = useUser();
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<WasteReport | null>(null);
  const [description, setDescription] = useState("");
  const [wasteCategory, setWasteCategory] = useState<"streetWaste" | "oldHousehold">("streetWaste");
  const [oldItemType, setOldItemType] = useState("");
  const [oldItemWeight, setOldItemWeight] = useState<number | "">("");
  const [calculatedPoints, setCalculatedPoints] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access or upload a photo instead.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setIsCameraActive(false);
  };

  const capturePicture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setPhotoPreview(dataUrl);
      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `photo_${Date.now()}.png`, { type: "image/png" });
          setPhoto(file);
        });
    }
    stopCamera();
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast({ title: "Location captured", description: "Your current location has been detected" });
      },
      () => {
        toast({
          title: "Location error",
          description: "Unable to get your location. Please enable location services.",
          variant: "destructive",
        });
      }
    );
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (evt) => setPhotoPreview(evt.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const calculatePoints = (item: string, value: number | "") =>
    item === "largeAppliance" ? (value ? value * 0.2 : 0) : oldItemPoints[item] || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({ title: "Please log in", description: "You need an account to report waste.", variant: "destructive" });
      return;
    }
    if (!photo || !location) {
      toast({ title: "Missing information", description: "Please provide a photo and location.", variant: "destructive" });
      return;
    }
    if (wasteCategory === "oldHousehold" && !oldItemType) {
      toast({ title: "Select item type", description: "Please select a type of item.", variant: "destructive" });
      return;
    }

    // Duplicate-spot detection: same-ish location reported recently.
    const duplicate = findNearbyDuplicate(location.lat, location.lng);
    if (duplicate) {
      toast({
        title: "Already reported nearby",
        description: `This spot looks like it matches report #${duplicate.id}, reported recently. Please avoid duplicate reports.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("category", wasteCategory);
    if (wasteCategory === "oldHousehold") {
      formData.append("itemType", oldItemType || "");
      formData.append("weight", oldItemWeight || "0");
    }
    formData.append("description", description || "");
    formData.append("lat", location.lat.toString());
    formData.append("lng", location.lng.toString());
    formData.append("city", currentUser.city || "");

    try {
      const res = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoading(false);
        toast({ title: "Could not submit", description: data.error || "Report submission failed.", variant: "destructive" });
        return;
      }
      setLoading(false);
      setSubmittedReport(data.report);
      toast({
        title: "Report submitted",
        description: `You earned ${data.pointsAwarded} points.`,
      });
    } catch {
      setLoading(false);
      toast({ title: "Error", description: "Failed to submit report.", variant: "destructive" });
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-green-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertTriangle className="mx-auto mb-4 text-muted-foreground" size={40} />
          <h2 className="text-2xl font-semibold mb-2">Log in to report waste</h2>
          <p className="text-muted-foreground mb-6">You need an account so we can track your points and report status.</p>
          <Link to="/auth">
            <Button variant="eco">Log in / Sign up</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (submittedReport) {
    return (
      <div className="min-h-screen bg-green-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <CheckCircle className="h-16 w-16 mx-auto text-success" />
                <h2 className="text-3xl font-semibold mt-4">Report Submitted!</h2>
                <p className="text-muted-foreground mt-2">Report #{submittedReport.id} — you earned {submittedReport.points} points.</p>
                <a
                  href={osmLink(submittedReport.lat, submittedReport.lng)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent text-sm underline inline-block mt-2"
                >
                  View location on map
                </a>
                <div className="flex flex-col gap-2 mt-6">
                  <Button onClick={() => setSubmittedReport(null)} variant="eco" className="w-full">
                    Report Another
                  </Button>
                  <Link to="/wallet">
                    <Button variant="outline" className="w-full">View Wallet</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto px-4 py-16 min-h-screen flex justify-center items-start">
        <Card className="max-w-xl w-full shadow-lg">
          <CardHeader>
            <CardTitle>Report Waste</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="category" className="block mb-2">
                  Waste Category
                </Label>
                <select
                  id="category"
                  value={wasteCategory}
                  onChange={(e) => setWasteCategory(e.target.value as "streetWaste" | "oldHousehold")}
                  className="w-full p-2 border rounded"
                >
                  <option value="streetWaste">Street Waste</option>
                  <option value="oldHousehold">Old Household</option>
                </select>
              </div>

              {wasteCategory === "oldHousehold" && (
                <div>
                  <Label htmlFor="itemType" className="block mb-2">
                    Item Type
                  </Label>
                  <select
                    id="itemType"
                    value={oldItemType}
                    onChange={(e) => {
                      setOldItemType(e.target.value);
                      setCalculatedPoints(calculatePoints(e.target.value, oldItemWeight));
                    }}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select item</option>
                    <option value="newspaperBundle">Newspaper Bundle</option>
                    <option value="oilCans">Oil Cans</option>
                    <option value="lamps">Lamp, Light, Decorative</option>
                    <option value="smallElectricalWires">Small Electrical Wires</option>
                    <option value="largeAppliance">Large Appliance</option>
                  </select>
                  {oldItemType === "largeAppliance" && (
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="Enter weight or value"
                      value={oldItemWeight}
                      onChange={(e) => {
                        const val = e.target.value ? parseFloat(e.target.value) : "";
                        setOldItemWeight(val);
                        setCalculatedPoints(calculatePoints(oldItemType, val));
                      }}
                      className="mt-2 w-full"
                    />
                  )}
                  <p className="mt-2 text-green-600 font-semibold">Estimated Points: {calculatedPoints}</p>
                </div>
              )}

              <div>
                <Label>Photo Evidence</Label>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 400,
                    height: 300,
                    margin: "auto",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  {!photoPreview && !isCameraActive && (
                    <div className="border-dashed border-2 border-border rounded-lg p-8 text-center">
                      <Camera className="mx-auto mb-4 text-muted" size={48} />
                      <p className="mb-4 text-muted">Capture or upload photo of waste</p>
                      <div className="flex justify-center gap-2">
                        <Button type="button" onClick={startCamera} variant="accent" className="flex items-center gap-2">
                          <Camera size={16} /> Start Camera
                        </Button>
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Upload size={16} /> Upload Photo
                        </Button>
                      </div>
                    </div>
                  )}
                  {isCameraActive && (
                    <div style={{ position: "relative" }}>
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        style={{ width: "100%", height: 300, objectFit: "cover" }}
                      />
                      <Button
                        type="button"
                        onClick={capturePicture}
                        variant="accent"
                        size="sm"
                        style={{ position: "absolute", bottom: 16, left: 16 }}
                      >
                        Capture Picture
                      </Button>
                      <Button
                        type="button"
                        onClick={stopCamera}
                        variant="destructive"
                        size="sm"
                        style={{ position: "absolute", bottom: 16, right: 16 }}
                      >
                        Cancel
                      </Button>
                      {location && (
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: 6,
                            fontSize: 14,
                            fontFamily: "monospace",
                            userSelect: "none",
                          }}
                        >
                          Lat: {location.lat.toFixed(6)}, Lon: {location.lng.toFixed(6)}
                        </div>
                      )}
                    </div>
                  )}
                  {photoPreview && (
                    <div style={{ position: "relative" }}>
                      <img
                        src={photoPreview}
                        alt="Captured"
                        style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 12, border: "2px solid #d1dade" }}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          setPhoto(null);
                          setPhotoPreview("");
                        }}
                        variant="outline"
                        size="sm"
                        style={{ position: "absolute", top: 8, right: 8 }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <Label>Location</Label>
                <div className="mt-2">
                  {location ? (
                    <div className="p-4 border rounded bg-green-100 text-green-700">
                      <div className="flex items-center gap-2">
                        <MapPin />
                        <span>Location captured</span>
                      </div>
                      <div>
                        Lat: {location.lat.toFixed(6)}, Lon: {location.lng.toFixed(6)}
                      </div>
                      <a href={osmLink(location.lat, location.lng)} target="_blank" rel="noreferrer" className="text-sm underline">
                        Preview on map
                      </a>
                    </div>
                  ) : (
                    <Button type="button" onClick={getLocation} className="w-full">
                      Get Location
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional details"
                  className="w-full"
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !photo || !location}
                size="lg"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  "Submit Report & Earn Points"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ReportWaste;
