import type { Metadata } from "next"
import { Phone, MapPin, Palette, Globe, Smartphone, BarChart, Briefcase, Code, Layers } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Our Services | Westlert Digitals - Yenda",
  description:
    "Westlert Digitals offers professional services including graphic design, web development, mobile app creation, digital marketing, branding, and more.",
}

export default function ServicesPage() {
  const services = [
    {
      title: "Graphic Designing",
      description:
        "Professional graphic design services for all your visual communication needs, including logos, brochures, posters, and social media graphics.",
      icon: Palette,
      color: "bg-pink-100 dark:bg-pink-900",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
    {
      title: "Website Creation",
      description:
        "Custom website design and development services tailored to your business needs, from simple landing pages to complex e-commerce platforms.",
      icon: Globe,
      color: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Mobile App Creation",
      description:
        "Native and cross-platform mobile application development for iOS and Android, delivering intuitive and engaging user experiences.",
      icon: Smartphone,
      color: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Digital Marketing",
      description:
        "Comprehensive digital marketing strategies including SEO, social media marketing, content marketing, and paid advertising campaigns.",
      icon: BarChart,
      color: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Branding",
      description:
        "Strategic brand development services to help you establish a strong and consistent brand identity that resonates with your target audience.",
      icon: Briefcase,
      color: "bg-orange-100 dark:bg-orange-900",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Product Design",
      description:
        "User-centered product design services focusing on creating intuitive, functional, and aesthetically pleasing digital products.",
      icon: Layers,
      color: "bg-red-100 dark:bg-red-900",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      title: "Web Development",
      description:
        "Full-stack web development services using the latest technologies to build responsive, secure, and scalable web applications.",
      icon: Code,
      color: "bg-indigo-100 dark:bg-indigo-900",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Business Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#b0468e] mb-2">Westlert Digitals</h1>
        <h2 className="text-2xl font-semibold mb-2">Our Services</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Professional digital solutions to help your business grow and succeed
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {services.map((service, index) => (
          <Card
            key={index}
            className="overflow-hidden border-t-4 hover:shadow-lg transition-shadow"
            style={{ borderTopColor: `var(--${service.iconColor.split("-")[1]}-500)` }}
          >
            <CardHeader className={`${service.color} flex flex-row items-center gap-4`}>
              <div className={`p-2 rounded-full ${service.iconColor} bg-white dark:bg-gray-800`}>
                <service.icon className="h-6 w-6" />
              </div>
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <CardDescription className="text-base text-gray-700 dark:text-gray-300">
                {service.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8 bg-gradient-to-r from-[#b0468e]/10 to-purple-100 dark:from-[#b0468e]/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="text-2xl">Contact Westlert Digitals</CardTitle>
          <CardDescription>Get in touch with us for professional digital services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-[#b0468e]" />
            <div>
              <p className="font-medium">Phone Numbers:</p>
              <p>0552662474 / 0539210458</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-[#b0468e]" />
            <div>
              <p className="font-medium">Location:</p>
              <p>Bibiani, Western North Region, Ghana</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="mb-4">Ready to take your business to the next level?</p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 bg-[#b0468e] text-white rounded-full hover:bg-[#b0468e]/90 transition-colors"
        >
          Contact Westlert Digitals
        </a>
      </div>
    </div>
  )
}
