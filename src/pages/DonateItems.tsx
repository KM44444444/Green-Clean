import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { Camera, Upload, CheckCircle, PackageSearch, Heart, Loader2 } from "lucide-react";
import { useUser, API_BASE } from "@/UserContext";

const itemCategories = [
  "Clothes", "Books", "Toys", "Electronics", "Furniture", "Utensils", "Other"
];
const conditionOptions = ["Like New", "Good", "Fair", "Needs Repair"];

const DonateItems = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [itemType, setItemType] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [myDonations, setMyDonations] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { token } = useUser();

  const fetchMyDonations = async () => {
    try {
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/donations/mine`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setMyDonations(data.donations || []);
    } catch {
      console.error("Failed to fetch donations");
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, [token]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (event) => setPhotoPreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemType) {
      toast({ title: "Select Category", description: "Please select what you are donating.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("itemType", itemType);
      formData.append("quantity", quantity);
      formData.append("condition", condition);
      formData.append("description", description);
      if (photo) formData.append("photo", photo);

      const res = await fetch(`${API_BASE}/api/donations`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error("Submission failed");

      setSubmitted(true);
      toast({ title: "Donation Listed", description: "Thank you for your generous donation!" });
      fetchMyDonations();
    } catch {
      toast({ title: "Error", description: "Could not submit donation.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-green-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <CheckCircle className="h-16 w-16 mx-auto text-success" />
                <h2 className="text-3xl font-semibold mt-4">Thank You!</h2>
                <p className="text-muted-foreground mt-2">Your item has been listed for donation.</p>
                <p className="text-muted-foreground mt-2">An NGO or individual will contact you soon.</p>
                <Button onClick={() => { setSubmitted(false); setPhoto(null); setPhotoPreview(""); setDescription(""); }} variant="eco" className="mt-6 w-full">Donate Another Item</Button>
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
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-8">
          <Heart className="mx-auto h-12 w-12 text-rose-500 mb-4" />
          <h1 className="text-4xl font-bold mb-4">Donate Reusable Items</h1>
          <p className="text-xl text-gray-600">Give your old items a second life. Don't throw away what someone else can use!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>List an Item for Donation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="itemType">Category</Label>
                  <select id="itemType" value={itemType} onChange={(e) => setItemType(e.target.value)} className="w-full p-2 border rounded mt-1">
                    <option value="">Select Category</option>
                    {itemCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <Label htmlFor="condition">Condition</Label>
                    <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full p-2 border rounded mt-1">
                      <option value="">Select Condition</option>
                      {conditionOptions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                    </select>
                  </div>
                  <div className="w-1/2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label>Photo (Optional but recommended)</Label>
                  <div className="mt-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50" onClick={() => fileInputRef.current?.click()}>
                    {photoPreview ? (
                      <div className="relative">
                        <img src={photoPreview} alt="Preview" className="h-48 mx-auto object-cover rounded" />
                        <Button type="button" onClick={(e) => { e.stopPropagation(); setPhoto(null); setPhotoPreview(""); }} variant="outline" size="sm" className="absolute top-2 right-2 bg-white">Remove</Button>
                      </div>
                    ) : (
                      <div className="py-8">
                        <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload a photo</p>
                      </div>
                    )}
                    <Input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description & Details</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="E.g. Size L shirts, barely worn..." rows={3} className="mt-1" />
                </div>

                <Button type="submit" disabled={loading} size="lg" className="w-full">
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "List for Donation"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-green-600 to-emerald-800 text-white">
              <CardContent className="p-8 text-center">
                <PackageSearch className="h-16 w-16 mx-auto mb-4 opacity-80" />
                <h3 className="text-2xl font-semibold mb-2">Your Impact</h3>
                <p className="text-white/80 mb-4">By donating instead of discarding, you've helped reduce landfill waste and supported those in need.</p>
                <div className="text-4xl font-bold">{myDonations.length}</div>
                <p className="text-sm uppercase tracking-wider mt-1 opacity-80">Items Donated</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Recent Donations</CardTitle>
              </CardHeader>
              <CardContent>
                {myDonations.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No items listed yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {myDonations.slice(0, 3).map((d: any) => (
                      <li key={d.id} className="p-3 border rounded flex justify-between items-center">
                        <div>
                          <p className="font-medium">{d.quantity}x {d.item_type}</p>
                          <p className="text-xs text-gray-500">{new Date(d.created_at).toLocaleDateString()} - {d.condition}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${d.status === "collected" ? "bg-gray-200 text-gray-700" : "bg-green-100 text-green-700"}`}>
                          {d.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DonateItems;
