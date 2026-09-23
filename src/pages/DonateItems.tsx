<<<<<<< HEAD
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useUser } from "@/UserContext";
import { addDonation, getDonations, timeAgo, Donation } from "@/lib/store";

const DonateItems = () => {
  const { toast } = useToast();
  const { currentUser } = useUser();
=======
import { useState } from "react";
import {
  Button
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";
import { Link } from "react-router-dom";

const DonateItems = () => {
  const { toast } = useToast();
>>>>>>> origin/main

  const [itemType, setItemType] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [myDonations, setMyDonations] = useState<Donation[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) setMyDonations(getDonations(currentUser.id));
  }, [currentUser]);
=======

  const fileInputRef = React.useRef<HTMLInputElement>(null);
>>>>>>> origin/main

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
<<<<<<< HEAD
      reader.onload = (evt) => setPhotoPreview(evt.target?.result as string);
=======
      reader.onload = (evt) => {
        setPhotoPreview(evt.target?.result as string);
      };
>>>>>>> origin/main
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

<<<<<<< HEAD
    if (!currentUser) {
      toast({ title: "Please log in", description: "You need an account to list a donation.", variant: "destructive" });
      return;
    }
    if (!itemType || !quantity || !condition) {
      toast({ title: "Incomplete Information", description: "Please fill all required fields.", variant: "destructive" });
=======
    if (!itemType || !quantity || !condition) {
      toast({
        title: "Incomplete Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
>>>>>>> origin/main
      return;
    }

    setLoading(true);
<<<<<<< HEAD
    const donation = addDonation({
      userId: currentUser.id,
      userName: currentUser.name,
      itemType,
      quantity: Number(quantity),
      condition,
      description,
      photoDataUrl: photoPreview || undefined,
    });
    setLoading(false);

    toast({ title: "Thank you!", description: "Your donation item offer has been listed successfully." });
    setMyDonations((prev) => [donation, ...prev]);
    setItemType("");
    setQuantity("");
    setCondition("");
    setDescription("");
    setPhoto(null);
    setPhotoPreview("");
=======

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Thank you!",
        description: "Your donation item offer has been submitted successfully.",
      });
      // Reset form
      setItemType("");
      setQuantity("");
      setCondition("");
      setDescription("");
      setPhoto(null);
      setPhotoPreview("");
    }, 2000);
>>>>>>> origin/main
  };

  return (
    <div className="min-h-screen bg-background">
<<<<<<< HEAD
=======
      <Navbar />
>>>>>>> origin/main
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Donate Items</h1>

        <Link to="/">
<<<<<<< HEAD
          <Button variant="outline" className="mb-6">Back to Home</Button>
        </Link>

        {!currentUser ? (
          <Card className="bg-gradient-card shadow-eco">
            <CardContent className="p-8 text-center">
              <p className="mb-4 text-muted-foreground">Log in to list an item for donation.</p>
              <Link to="/auth"><Button variant="eco">Log in / Sign up</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-card shadow-eco">
            <CardHeader>
              <CardTitle>Donation Form</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="itemType" className="text-base font-semibold">Item Type *</Label>
                  <select
                    id="itemType"
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    className="w-full p-2 mt-1 border rounded"
                    required
                  >
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
                  <Input
                    type="number"
                    id="quantity"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value ? parseInt(e.target.value) : "")}
                    placeholder="Number of items"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="condition" className="text-base font-semibold">Condition *</Label>
                  <select
                    id="condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full p-2 mt-1 border rounded"
                    required
                  >
                    <option value="">--Select Condition--</option>
                    <option value="new">New</option>
                    <option value="good">Good</option>
                    <option value="used">Used</option>
                    <option value="worn">Worn</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-base font-semibold">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Additional details about the item..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold">Photo of Item (Optional)</Label>
                  <div className="mt-2 space-y-4">
                    {photoPreview ? (
                      <div className="relative">
                        <img src={photoPreview} alt="Item preview" className="w-full h-48 object-cover rounded-lg border-2 border-border" />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => { setPhoto(null); setPhotoPreview(""); }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <p className="text-muted-foreground mb-4">Click to upload a photo</p>
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

                <Button type="submit" variant="eco" size="lg" disabled={loading} className="w-full">
                  {loading ? "Submitting..." : "Submit Donation"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {currentUser && myDonations.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">My Donations</h2>
            <div className="space-y-3">
              {myDonations.map((d) => (
                <Card key={d.id} className="bg-gradient-card shadow-card">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize">{d.itemType} × {d.quantity} ({d.condition})</p>
                      <p className="text-xs text-muted-foreground">{timeAgo(d.createdAt)}</p>
                    </div>
                    <Badge className={d.status === "collected" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
                      {d.status === "collected" ? "Collected" : "Listed"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
=======
          <Button variant="outline" className="mb-6">
            Back to Home
          </Button>
        </Link>

        <Card className="bg-gradient-card shadow-eco">
          <CardHeader>
            <CardTitle>Donation Form</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="itemType" className="text-base font-semibold">
                  Item Type *
                </Label>
                <select
                  id="itemType"
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  className="w-full p-2 mt-1 border rounded"
                  required
                >
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
                <Label htmlFor="quantity" className="text-base font-semibold">
                  Quantity *
                </Label>
                <Input
                  type="number"
                  id="quantity"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value ? parseInt(e.target.value) : "")}
                  placeholder="Number of items"
                  required
                />
              </div>

              <div>
                <Label htmlFor="condition" className="text-base font-semibold">
                  Condition *
                </Label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full p-2 mt-1 border rounded"
                  required
                >
                  <option value="">--Select Condition--</option>
                  <option value="new">New</option>
                  <option value="good">Good</option>
                  <option value="used">Used</option>
                  <option value="worn">Worn</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-semibold">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional details about the item..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-base font-semibold">Photo of Item (Optional)</Label>
                <div className="mt-2 space-y-4">
                  {photoPreview ? (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Item preview"
                        className="w-full h-48 object-cover rounded-lg border-2 border-border"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setPhoto(null);
                          setPhotoPreview("");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <p className="text-muted-foreground mb-4">Click to upload a photo</p>
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

              <Button type="submit" variant="eco" size="lg" disabled={loading} className="w-full">
                {loading ? "Submitting..." : "Submit Donation"}
              </Button>
            </form>
          </CardContent>
        </Card>
>>>>>>> origin/main
      </div>
      <Footer />
    </div>
  );
};

export default DonateItems;
