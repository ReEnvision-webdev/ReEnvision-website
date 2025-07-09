import Image from "@/components/ui/image";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen justify-evenly items-center">
            <h1 className="text-3xl font-bold mb-4">About Us</h1>
            <section className="container mx-auto px-4 py-8">
                <p className="text-lg text-[#0C0C0C] text-center">Sometext</p>
            </section>
            <section>
                <div id="teams" className="container mx-auto px-4 py-8">
                    <h2 className="text-center text-2xl font-semibold mb-4">Our Teams</h2>
                    <div className="grid grid-cols-2 grid-rows-2 gap-x-18 gap-y-8 justify-center items-center mx-auto px-4 py-8 border-black">
                        <Card className="flex flex-col gap-4 justify-evenly items-center">
                            <CardContent>
                                <Image
                                    src="/favicon.png"
                                    width={200}
                                    height={200}
                                    alt="Team Member 1"
                                    className="rounded-full"
                                />
                                <p className="text-center">Hello, world!</p>
                            </CardContent>
                        </Card>
                        <Card className="flex flex-col gap-4 justify-evenly items-center">
                            <CardContent>
                                <Image
                                    src="/favicon.png"
                                    width={200}
                                    height={200}
                                    alt="Team Member 1"
                                    className="rounded-full"
                                />
                                <p className="text-center">Hello, world!</p>
                            </CardContent>
                        </Card>
                        <Card className="flex flex-col gap-4 justify-evenly items-center">
                            <CardContent>
                                <Image
                                    src="/favicon.png"
                                    width={200}
                                    height={200}
                                    alt="Team Member 1"
                                    className="rounded-full"
                                />
                                <p className="text-center">Hello, world!</p>
                            </CardContent>
                        </Card>
                        <Card className="flex flex-col gap-4 justify-evenly items-center">
                            <CardContent>
                                <Image
                                    src="/favicon.png"
                                    width={200}
                                    height={200}
                                    alt="Team Member 1"
                                    className="rounded-full"
                                />
                                <p className="text-center">Hello, world!</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
