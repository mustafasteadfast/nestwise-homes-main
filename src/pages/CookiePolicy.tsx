import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center space-x-3 mb-6">
            <Cookie className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Cookie Policy</h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>What Are Cookies</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                Cookies are small text files that are stored on your computer or mobile device when you
                visit our website. They allow us to remember your preferences and improve your browsing
                experience by providing features and functionality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Cookies</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>We use cookies for the following purposes:</p>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <h3>Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function and cannot be switched off in our systems.
                They are usually only set in response to actions made by you which amount to a request for services.
              </p>

              <h3>Analytics Cookies</h3>
              <p>
                These cookies allow us to count visits and traffic sources so we can measure and improve the
                performance of our site. They help us to know which pages are the most and least popular.
              </p>

              <h3>Functional Cookies</h3>
              <p>
                These cookies enable the website to provide enhanced functionality and personalization.
                They may be set by us or by third-party providers whose services we have added to our pages.
              </p>

              <h3>Marketing Cookies</h3>
              <p>
                These cookies may be set through our site by our advertising partners. They may be used by
                those companies to build a profile of your interests and show you relevant adverts.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specific Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-4 py-2 text-left">Cookie Name</th>
                      <th className="border border-border px-4 py-2 text-left">Purpose</th>
                      <th className="border border-border px-4 py-2 text-left">Duration</th>
                      <th className="border border-border px-4 py-2 text-left">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2">session_token</td>
                      <td className="border border-border px-4 py-2">User authentication</td>
                      <td className="border border-border px-4 py-2">Session</td>
                      <td className="border border-border px-4 py-2">Essential</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">_ga</td>
                      <td className="border border-border px-4 py-2">Google Analytics</td>
                      <td className="border border-border px-4 py-2">2 years</td>
                      <td className="border border-border px-4 py-2">Analytics</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">theme_preference</td>
                      <td className="border border-border px-4 py-2">Remember theme choice</td>
                      <td className="border border-border px-4 py-2">1 year</td>
                      <td className="border border-border px-4 py-2">Functional</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">search_history</td>
                      <td className="border border-border px-4 py-2">Store search preferences</td>
                      <td className="border border-border px-4 py-2">30 days</td>
                      <td className="border border-border px-4 py-2">Functional</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Managing Cookies</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>You can control and manage cookies in various ways:</p>

              <h3>Browser Settings</h3>
              <p>
                Most web browsers allow you to control cookies through their settings. You can usually
                find these settings in the 'Options' or 'Preferences' menu of your browser.
              </p>

              <h3>Our Cookie Settings</h3>
              <p>
                You can manage your cookie preferences through our cookie consent banner or by
                contacting us directly to opt out of non-essential cookies.
              </p>

              <h3>Third-Party Opt-Out</h3>
              <p>
                Some third-party services we use may provide their own opt-out mechanisms.
                For example, you can opt out of Google Analytics by visiting Google's
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ads Settings</a>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impact of Disabling Cookies</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                If you disable certain cookies, some features of our website may not function properly.
                For example:
              </p>
              <ul>
                <li>You may not be able to stay logged in</li>
                <li>Your preferences may not be remembered</li>
                <li>Some website features may be slower or less efficient</li>
                <li>You may see less relevant property recommendations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                In some cases, we use third-party services that may set their own cookies. We have no
                direct control over these cookies. Please refer to the respective privacy policies of
                these third parties for more information about their cookies.
              </p>
              <p>Examples include:</p>
              <ul>
                <li>Google Analytics for website analytics</li>
                <li>Social media plugins for sharing functionality</li>
                <li>Payment processors for secure transactions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices
                or for other operational, legal, or regulatory reasons. We will notify you of any material
                changes by posting the updated policy on this page.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>Email:</strong> privacy@nestwisehomes.com</p>
                <p><strong>Phone:</strong> +880 1XXX-XXXXXX</p>
                <p><strong>Address:</strong> Dhaka, Bangladesh</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
