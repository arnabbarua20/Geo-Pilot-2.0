import { AlertTriangle, MapPin, HelpCircle, CheckCircle, LogIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import ZoneReportForm from "@/components/forms/zone-report-form";

export default function ReportZone() {
  const { user, signInWithGoogle, authAvailable } = useAuth();

  if (!user) {
    return (
      <div className="h-full w-full bg-gray-50 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6">
          <Card className="text-center">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogIn className="text-primary text-2xl" />
              </div>
              <h2 className="text-2xl font-semibold text-neutral mb-4">Sign in Required</h2>
              <p className="text-gray-600 mb-6">
                To report drone-restricted areas, please sign in with your Google account. 
                This helps us verify reports and maintain accurate airspace information.
              </p>
              {authAvailable ? (
                <Button 
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 mx-auto"
                >
                  <LogIn className="w-4 h-4" />
                  Sign in with Google
                </Button>
              ) : (
                <div className="text-gray-500">
                  <p className="mb-2">Authentication is not available</p>
                  <p className="text-sm">Firebase configuration needed for user sign-in</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        
        {/* Form Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-primary text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-neutral">Report Drone-Restricted Area</h2>
                <p className="text-gray-600">Help keep our skies safe by reporting new restricted zones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <ZoneReportForm />
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-blue-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-neutral mb-3 flex items-center">
              <HelpCircle className="mr-2 text-primary w-5 h-5" />
              Reporting Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mt-1 mr-2 w-3 h-3" />
                Verify the location coordinates are accurate before submitting
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mt-1 mr-2 w-3 h-3" />
                Include specific details about why the area should be restricted
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mt-1 mr-2 w-3 h-3" />
                Provide contact information for verification if possible
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mt-1 mr-2 w-3 h-3" />
                Reports are reviewed within 48 hours by aviation authorities
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
