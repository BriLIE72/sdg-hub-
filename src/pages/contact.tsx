Index: src/pages/contact.tsx
===================================================================
--- src/pages/contact.tsx	non-existent
+++ src/pages/contact.tsx	new file
@@ -0,0 +1,339 @@
+import { useState } from 'react';
+import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
+import { Button } from '@/components/ui/button';
+import { Input } from '@/components/ui/input';
+import { Label } from '@/components/ui/label';
+import { Textarea } from '@/components/ui/textarea';
+import {
+  Select,
+  SelectContent,
+  SelectItem,
+  SelectTrigger,
+  SelectValue,
+} from '@/components/ui/select';
+import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
+import {
+  Mail,
+  Phone,
+  MapPin,
+  Clock,
+  Send,
+  CheckCircle,
+  AlertCircle,
+  MessageSquare,
+  Users,
+  FileText,
+  HelpCircle,
+} from 'lucide-react';
+
+export default function ContactPage() {
+  const [formData, setFormData] = useState({
+    name: '',
+    email: '',
+    phone: '',
+    category: '',
+    subject: '',
+    message: '',
+  });
+  const [loading, setLoading] = useState(false);
+  const [success, setSuccess] = useState(false);
+  const [error, setError] = useState('');
+  const [ticketNumber, setTicketNumber] = useState('');
+
+  const handleSubmit = async (e: React.FormEvent) => {
+    e.preventDefault();
+    setLoading(true);
+    setError('');
+    setSuccess(false);
+
+    try {
+      const response = await fetch('/api/contact', {
+        method: 'POST',
+        headers: {
+          'Content-Type': 'application/json',
+        },
+        body: JSON.stringify(formData),
+      });
+
+      const data = await response.json();
+
+      if (data.success) {
+        setSuccess(true);
+        setTicketNumber(data.data.ticketNumber);
+        setFormData({
+          name: '',
+          email: '',
+          phone: '',
+          category: '',
+          subject: '',
+          message: '',
+        });
+      } else {
+        setError(data.error || 'Failed to submit form');
+      }
+    } catch (err) {
+      setError('Failed to submit form. Please try again.');
+      console.error('Contact form error:', err);
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  const handleChange = (field: string, value: string) => {
+    setFormData({ ...formData, [field]: value });
+  };
+
+  return (
+    <div className="flex flex-col gap-6 p-6">
+      {/* Header */}
+      <div>
+        <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
+        <p className="text-muted-foreground">
+          Get in touch with the SDG Hub team. We're here to help!
+        </p>
+      </div>
+
+      <div className="grid gap-6 lg:grid-cols-3">
+        {/* Contact Form */}
+        <div className="lg:col-span-2">
+          <Card>
+            <CardHeader>
+              <CardTitle>Send us a message</CardTitle>
+              <CardDescription>
+                Fill out the form below and we'll get back to you within 24 hours
+              </CardDescription>
+            </CardHeader>
+            <CardContent>
+              {success && (
+                <Alert className="mb-6 bg-green-50 dark:bg-green-950 border-green-200">
+                  <CheckCircle className="h-4 w-4 text-green-600" />
+                  <AlertTitle>Message sent successfully!</AlertTitle>
+                  <AlertDescription>
+                    Your ticket number is <strong>{ticketNumber}</strong>. We'll respond within 24
+                    hours.
+                  </AlertDescription>
+                </Alert>
+              )}
+
+              {error && (
+                <Alert variant="destructive" className="mb-6">
+                  <AlertCircle className="h-4 w-4" />
+                  <AlertTitle>Error</AlertTitle>
+                  <AlertDescription>{error}</AlertDescription>
+                </Alert>
+              )}
+
+              <form onSubmit={handleSubmit} className="space-y-4">
+                <div className="grid gap-4 md:grid-cols-2">
+                  <div className="space-y-2">
+                    <Label htmlFor="name">
+                      Name <span className="text-red-500">*</span>
+                    </Label>
+                    <Input
+                      id="name"
+                      value={formData.name}
+                      onChange={(e) => handleChange('name', e.target.value)}
+                      placeholder="Your full name"
+                      required
+                    />
+                  </div>
+                  <div className="space-y-2">
+                    <Label htmlFor="email">
+                      Email <span className="text-red-500">*</span>
+                    </Label>
+                    <Input
+                      id="email"
+                      type="email"
+                      value={formData.email}
+                      onChange={(e) => handleChange('email', e.target.value)}
+                      placeholder="your.email@example.com"
+                      required
+                    />
+                  </div>
+                </div>
+
+                <div className="grid gap-4 md:grid-cols-2">
+                  <div className="space-y-2">
+                    <Label htmlFor="phone">Phone (Optional)</Label>
+                    <Input
+                      id="phone"
+                      type="tel"
+                      value={formData.phone}
+                      onChange={(e) => handleChange('phone', e.target.value)}
+                      placeholder="+1 (555) 000-0000"
+                    />
+                  </div>
+                  <div className="space-y-2">
+                    <Label htmlFor="category">
+                      Category <span className="text-red-500">*</span>
+                    </Label>
+                    <Select value={formData.category} onValueChange={(value) => handleChange('category', value)} required>
+                      <SelectTrigger id="category">
+                        <SelectValue placeholder="Select a category" />
+                      </SelectTrigger>
+                      <SelectContent>
+                        <SelectItem value="general">General Inquiry</SelectItem>
+                        <SelectItem value="technical">Technical Support</SelectItem>
+                        <SelectItem value="policy">Policy Questions</SelectItem>
+                        <SelectItem value="partnership">Partnership Opportunities</SelectItem>
+                        <SelectItem value="data">Data Access Request</SelectItem>
+                        <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
+                      </SelectContent>
+                    </Select>
+                  </div>
+                </div>
+
+                <div className="space-y-2">
+                  <Label htmlFor="subject">
+                    Subject <span className="text-red-500">*</span>
+                  </Label>
+                  <Input
+                    id="subject"
+                    value={formData.subject}
+                    onChange={(e) => handleChange('subject', e.target.value)}
+                    placeholder="Brief description of your inquiry"
+                    required
+                  />
+                </div>
+
+                <div className="space-y-2">
+                  <Label htmlFor="message">
+                    Message <span className="text-red-500">*</span>
+                  </Label>
+                  <Textarea
+                    id="message"
+                    value={formData.message}
+                    onChange={(e) => handleChange('message', e.target.value)}
+                    placeholder="Please provide details about your inquiry..."
+                    rows={6}
+                    required
+                  />
+                </div>
+
+                <Button type="submit" className="w-full" disabled={loading}>
+                  {loading ? (
+                    <>
+                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
+                      Sending...
+                    </>
+                  ) : (
+                    <>
+                      <Send className="mr-2 h-4 w-4" />
+                      Send Message
+                    </>
+                  )}
+                </Button>
+              </form>
+            </CardContent>
+          </Card>
+        </div>
+
+        {/* Contact Information */}
+        <div className="space-y-6">
+          {/* Contact Details */}
+          <Card>
+            <CardHeader>
+              <CardTitle>Contact Information</CardTitle>
+              <CardDescription>Reach us through any of these channels</CardDescription>
+            </CardHeader>
+            <CardContent className="space-y-4">
+              <div className="flex items-start gap-3">
+                <Mail className="h-5 w-5 text-primary mt-0.5" />
+                <div>
+                  <p className="font-medium">Email</p>
+                  <a href="mailto:info@sdghub.gov" className="text-sm text-muted-foreground hover:text-primary">
+                    info@sdghub.gov
+                  </a>
+                </div>
+              </div>
+              <div className="flex items-start gap-3">
+                <Phone className="h-5 w-5 text-primary mt-0.5" />
+                <div>
+                  <p className="font-medium">Phone</p>
+                  <a href="tel:+15550001234" className="text-sm text-muted-foreground hover:text-primary">
+                    +1 (555) 000-1234
+                  </a>
+                </div>
+              </div>
+              <div className="flex items-start gap-3">
+                <MapPin className="h-5 w-5 text-primary mt-0.5" />
+                <div>
+                  <p className="font-medium">Address</p>
+                  <p className="text-sm text-muted-foreground">
+                    123 Government Plaza
+                    <br />
+                    Capital City, ST 12345
+                  </p>
+                </div>
+              </div>
+              <div className="flex items-start gap-3">
+                <Clock className="h-5 w-5 text-primary mt-0.5" />
+                <div>
+                  <p className="font-medium">Office Hours</p>
+                  <p className="text-sm text-muted-foreground">
+                    Monday - Friday
+                    <br />
+                    9:00 AM - 5:00 PM
+                  </p>
+                </div>
+              </div>
+            </CardContent>
+          </Card>
+
+          {/* Quick Links */}
+          <Card>
+            <CardHeader>
+              <CardTitle>Quick Links</CardTitle>
+              <CardDescription>Find answers faster</CardDescription>
+            </CardHeader>
+            <CardContent className="space-y-2">
+              <Button variant="outline" className="w-full justify-start" asChild>
+                <a href="/knowledge-center">
+                  <FileText className="mr-2 h-4 w-4" />
+                  Knowledge Center
+                </a>
+              </Button>
+              <Button variant="outline" className="w-full justify-start" asChild>
+                <a href="/multi-stakeholder">
+                  <Users className="mr-2 h-4 w-4" />
+                  Stakeholder Portal
+                </a>
+              </Button>
+              <Button variant="outline" className="w-full justify-start" asChild>
+                <a href="/public-transparency">
+                  <MessageSquare className="mr-2 h-4 w-4" />
+                  Public Feedback
+                </a>
+              </Button>
+              <Button variant="outline" className="w-full justify-start">
+                <HelpCircle className="mr-2 h-4 w-4" />
+                FAQ
+              </Button>
+            </CardContent>
+          </Card>
+
+          {/* Response Time */}
+          <Card>
+            <CardHeader>
+              <CardTitle>Response Time</CardTitle>
+            </CardHeader>
+            <CardContent className="space-y-3">
+              <div className="flex items-center justify-between">
+                <span className="text-sm">General Inquiries</span>
+                <span className="text-sm font-medium">24 hours</span>
+              </div>
+              <div className="flex items-center justify-between">
+                <span className="text-sm">Technical Support</span>
+                <span className="text-sm font-medium">48 hours</span>
+              </div>
+              <div className="flex items-center justify-between">
+                <span className="text-sm">Partnership Requests</span>
+                <span className="text-sm font-medium">3-5 days</span>
+              </div>
+            </CardContent>
+          </Card>
+        </div>
+      </div>
+    </div>
+  );
+}
