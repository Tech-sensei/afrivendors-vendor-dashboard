import React from 'react'
import Link from 'next/link'

const page = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Stripe account setup refresh</p>
            <Link href="/dashboard">Go to dashboard</Link>
        </div>
    )
}

export default page