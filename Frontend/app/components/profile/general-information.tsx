import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function GeneralInformation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <p className="text-sm text-gray-500">
          As we live, our hearts turn colder. Cause pain is what we go through as we become older. We get insulted by
          others, lose trust for those others. We get back stabbed by friends. It becomes harder for us to give others a
          hand. We get our heart broken by people we love, even that we give them all...
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-500 mb-1">Education</h4>
            <p className="text-gray-900">Stanford University</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-500 mb-1">Languages</h4>
            <p className="text-gray-900">English, Spanish, Italian</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-500 mb-1">Department</h4>
            <p className="text-gray-900">Product Design</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-500 mb-1">Work History</h4>
            <p className="text-gray-900">Google, Facebook</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-500 mb-1">Organization</h4>
            <p className="text-gray-900">Simmple Web LLC</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-500 mb-1">Birthday</h4>
            <p className="text-gray-900">20 July 1986</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
