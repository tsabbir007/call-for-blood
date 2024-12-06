import ProcessItem from "./process-item"

export default function DonationProcess() {
    const process = [
        {
            color: "bg-red-100 text-red-500",
            title: "Registration",
            description: "Register for the donation process by providing your basic information and confirming your eligibility to donate blood."
        },
        {
            color: "bg-blue-100 text-blue-500",
            title: "Screening",
            description: "Our medical team will assess your health and eligibility to donate blood. This includes checking your blood pressure, hemoglobin levels, and any medical conditions."
        },
        {
            color: "bg-green-100 text-green-500",
            title: "Donation",
            description: "During the donation, you will be seated comfortably in a chair while the blood is collected. The process typically takes about 10-15 minutes."
        },
        {
            color: "bg-yellow-100 text-yellow-500",
            title: "Refreshment",
            description: "After the donation, you will be given refreshments and a small snack to help you recover. You will also receive a certificate of donation as a thank you for your contribution."
        }
    ]
    return (
        <div id="donation-process" className="space-y-4 pt-20">
            <h2 className="text-3xl font-bold">Donation Process</h2>
            <p className="text-sm !mb-10 max-w-2xl">We are a team of dedicated professionals who are passionate about saving lives through blood donation. Our journey began in 2021, and since then, we have been committed to making a difference in the lives of those in need.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {process.map((item, index) => (
                    <ProcessItem
                        key={index}
                        color={item.color}  
                        order={index + 1}
                        title={item.title}
                        description={item.description}
                    />
                ))}
            </div>

        </div>
    )
}

