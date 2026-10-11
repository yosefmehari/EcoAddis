"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { ADDIS_ABABA_SUB_CITIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subCity: "Bole",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate support ticket creation
    setSubmitted(true);
  };

  return (
    <div className="py-12 bg-gray-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-1 rounded-full">
            Customer Support & Operations
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950 mt-3">
            Contact EcoAddis Operations
          </h1>
          <p className="text-gray-600 text-sm mt-3">
            Have questions about household pickups, commercial contracts, recycling center listings, or collection issues? Our Addis Ababa operations team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-gray-200">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">Central Office</h3>
                  <p className="text-xs text-gray-500">Visit us or send direct physical mail</p>
                </div>

                <div className="space-y-4 text-xs text-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-forest-50 text-forest-800 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Addis Ababa Operations Hub</div>
                      <p className="text-gray-600 mt-0.5">Bole Medhanialem Area, Atlas Commercial Axis, Addis Ababa, Ethiopia</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-forest-50 text-forest-800 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Phone Support</div>
                      <p className="text-gray-600 mt-0.5">+251 911 00 22 33 / +251 116 22 33 44</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-forest-50 text-forest-800 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Email Inquiries</div>
                      <p className="text-gray-600 mt-0.5">support@ecoaddis.et • ops@ecoaddis.et</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-forest-50 text-forest-800 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Dispatch Operating Hours</div>
                      <p className="text-gray-600 mt-0.5">Monday – Saturday: 7:30 AM – 6:30 PM (Closed Sundays)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-8">
                {submitted ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Message Received</h3>
                    <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                      Thank you for contacting EcoAddis. Our Addis Ababa operations team has received your ticket and will respond to {formData.email || "your email"} promptly.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSubmitted(false)}
                      className="mt-4"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Send a Message</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Your Full Name"
                        required
                        placeholder="e.g. Selamawit Tadesse"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Phone Number"
                        required
                        placeholder="0911223344"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Sub-City
                        </label>
                        <select
                          value={formData.subCity}
                          onChange={(e) => setFormData({ ...formData, subCity: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                        >
                          {ADDIS_ABABA_SUB_CITIES.map((sc) => (
                            <option key={sc.id} value={sc.name}>
                              {sc.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <Input
                      label="Subject"
                      required
                      placeholder="e.g. Commercial collection inquiry, or failed pickup ticket"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Message or Issue Details
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Please describe your pickup inquiry, specific building address, or question..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-forest-800 hover:bg-forest-900 gap-2">
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
