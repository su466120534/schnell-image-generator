import { HiDownload } from "react-icons/hi";
import { toast } from "sonner";

const ImageContainer = ({ imageSrc }: { imageSrc: string | null }) => {
  const downloadImage = () => {
    if (imageSrc) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let filename = "";
      for (let i = 0; i < 8; i++) {
        filename += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      const link = document.createElement("a");
      link.href = imageSrc;
      link.download = `${filename}.png`; // You can adjust the filename and extension if needed
      link.click();
    }
  };

  return (
    <div className="relative flex-1 flex aspect-square p-4 md:p-8 justify-center items-center">
      {imageSrc ? (
        <>
          <img
            src={imageSrc}
            alt="Generated"
            className="rounded-lg shadow-neutral-400 shadow-md drop-shadow-md max-w-full max-h-full object-contain"
            onError={() => toast.error("Failed to load image.")}
          />
          <div className="absolute bottom-12 flex gap-4 items-center justify-center">
            <button
              onClick={downloadImage}
              className="bg-slate-200 text-green-600 p-3 rounded-full shadow-neutral-800 shadow-lg transition-all ease-linear hover:-translate-y-1"
            >
              <HiDownload size="1.6em" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center p-32 md:p-56 border-2 border-dashed border-gray-400 rounded-lg bg-gray-200">
          <span className="text-gray-500 text-xl 2xl:text-2xl">
            Empty canvas... 🖼️
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageContainer;
