import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900">
            <div className="text-center space-y-6 max-w-md px-4">
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileQuestion className="w-10 h-10 text-blue-600" />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Page Not Found</h2>

                <p className="text-slate-500 text-lg">
                    Sorry, the page you are looking for doesn't exist or is currently under development.
                </p>

                <div className="pt-4">
                    <Button asChild className="bg-blue-800 hover:bg-blue-900 text-white">
                        <Link href="/">
                            Return to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
