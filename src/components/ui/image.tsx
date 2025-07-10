import NextImage from "next/image";
import { Suspense } from "react";

interface ImageProps {
    src: string;
    width: number;
    height: number;
    alt: string;
    className?: string;
}

const Image = (props: ImageProps) => {
    return (
        <Suspense
            fallback={
                <div
                    className={`w-[${props.width}px] h-[${props.height}px] bg-gray-300 animate-pulse ${props.className}`}
                ></div>
            }
        >
            <NextImage src={props.src} width={props.width} height={props.height} alt={props.alt} />
        </Suspense>
    );
};

export default Image;

