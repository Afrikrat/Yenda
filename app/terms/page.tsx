import Header from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="container px-4 py-6 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Yenda. These Terms and Conditions govern your use of the Yenda mobile application and website
              (collectively, the "Service"), operated by Westlert Digitals and managed by JayGuy Records.
            </p>
            <p className="mb-4">
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of
              the terms, you may not access the Service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">2. Use of the Service</h2>
            <p className="mb-4">
              Yenda provides a platform for discovering and engaging with events in Ghana's Western North region. Users
              may browse events, read blog posts, create accounts, save events, and RSVP to events through the Service.
            </p>
            <p className="mb-4">
              You are responsible for maintaining the confidentiality of your account and password and for restricting
              access to your computer or mobile device. You agree to accept responsibility for all activities that occur
              under your account.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">3. Event Information</h2>
            <p className="mb-4">
              While we strive to provide accurate and up-to-date information about events, Yenda does not guarantee the
              accuracy, completeness, or reliability of any event information displayed on the Service. Event details,
              including dates, times, locations, and descriptions, are provided by event organizers and may be subject
              to change.
            </p>
            <p className="mb-4">
              Users are encouraged to verify event details with the event organizers directly before making plans to
              attend.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">4. User Content</h2>
            <p className="mb-4">
              Users may submit content to the Service, including but not limited to event reviews, comments, and profile
              information. By submitting content, you grant Yenda a worldwide, non-exclusive, royalty-free license to
              use, reproduce, modify, adapt, publish, translate, and distribute your content in any existing or future
              media.
            </p>
            <p className="mb-4">
              You represent and warrant that your content does not violate any third-party rights, including copyright,
              trademark, privacy, or other personal or proprietary rights, and does not contain unlawful, defamatory, or
              objectionable material.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">5. Privacy Policy</h2>
            <p className="mb-4">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
              personal information when you use our Service. By using Yenda, you agree to the collection and use of
              information in accordance with our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">6. Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall Yenda, Westlert Digitals, JayGuy Records, or their directors, employees, partners,
              agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or
              punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible
              losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">7. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
              provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change
              will be determined at our sole discretion.
            </p>
            <p className="mb-4">
              By continuing to access or use our Service after any revisions become effective, you agree to be bound by
              the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">8. Contact Us</h2>
            <p className="mb-4">If you have any questions about these Terms, please contact us:</p>
            <p className="mb-4">
              JayGuy Records
              <br />
              Phone/WhatsApp: 0554688406
              <br />
              Email: info@yenda.com
            </p>
            <p className="text-sm text-muted-foreground">Last updated: May 8, 2023</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
