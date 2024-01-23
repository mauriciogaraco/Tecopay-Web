import { useState, useEffect } from "react";
import { Blurhash } from "react-blurhash";
import { CiImageOn } from "react-icons/ci";

interface ImageInterface {
  className?: string;
  hash?: string | null;
  src?: string | null;
}

const ImageComponent = ({ className, hash, src }: ImageInterface) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!!src) {
      const img = new Image();
      img.src = src;
      img.onload = () => setImgLoaded(true);
      img.onerror = () => setImgLoaded(true);
    }
  }, [src]);

  if (!imgLoaded && src && !hash)
    return (
      <div className={className ? className : ""}>
        <CiImageOn className="animate-pulse text-gray-600 object-cover h-full w-full" />
      </div>
    );
  if (imgLoaded && src)
    return (
      <div className={className ? className : ""}>
        <img className="object-cover h-full w-full" src={src} alt="imagen" />
      </div>
    );
  if (!imgLoaded && hash)
    return (
      <div className={className ? className : ""}>
        <Blurhash
          hash={'LEHV6nWB2yk8pyo0adR*.7kCMdnj'}
          style={{
            minWidth: "100%",
            minHeight: "100%",
            objectFit: "scale-down",
            padding: 5,
          }}
          width={"100%"}
          height={"100%"}
        />
      </div>
    );
  return (
    <img
      className={className ? className : ""}
      src={require("../../../assets/image-default.jpg")}
    />
  );
};

export default ImageComponent;
