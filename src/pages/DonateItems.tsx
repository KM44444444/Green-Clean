import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

const DonateItems = () => {
  const { toast } = useToast();
  const [itemType, setItemType] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPhotoPreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemType || !quantity || !condition) {
      toast({ title: "Incomplete information", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    toast({ title: "Thank you!", description: "Your donation item offer has been submitted successfully." });
    setItemType("");
    setQuantity("");
    setCondition("");
    setDescription("");
    setPhotoPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Donate Items</h1>

        <Card className="bg-gradient-card shadow-eco">
          <CardHeader>
            <CardTitle>Donation Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="itemType" className="text-base font-semibold">Item Type *</Label>
                <select id="itemType" value={itemType} onChange={(e) => setItemType(e.target.value)} className="w-full p-2 mt-1 border rounded" required>
                  <option value="">--Select Item Type--</option>
                  <option value="books">Books</option>
                  <option value="clothes">Clothes</option>
                  <option value="kitchenware">Kitchenware</option>
                  <option value="toys">Toys</option>
                  <option value="furniture">Furniture</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="quantity" className="text-base font-semibold">Quantity *</Label>
                <Input type="number" id="quantity" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value ? parseInt(e.target.value) : "")} placeholder="Number of items" required />
              </div>

              <div>
                <Label htmlFor="condition" className="text-base font-semibold">Condition *</Label>
                <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full p-2 mt-1 border rounded" required>
                  <option value="">--Select Condition--</option>
                  <option value="new">New</option>
                  <option value="good">Good</option>
                  <option value="used">Used</option>
                  <option value="worn">Worn</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-semibold">Description (Optional)</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Additional details about the item..." rows={3} className="mt-1" />
              </div>

              <div>
                <Label className="text-base font-semibold">Photo of Item (Optional)</Label>
                <div className="mt-2 space-y-4">
                  {photoPreview ? (
                    <div className="relative">
                      <img src={photoPreview} alt="Item preview" className="w-full h-48 object-cover rounded-lg border-2 border-border" />
                      <Button type="button" variant="outline" size="sm" className="absolute top-2 right-2" onClick={() => setPhotoPreview("")}>Remove</Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <p className="text-muted-foreground mb-4">Click to upload a photo</p>
                    </div>
                  )}
                  <Input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </div>
              </div>

              <Button type="submit" variant="eco" size="lg" className="w-full">Submit Donation</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default DonateItems;
