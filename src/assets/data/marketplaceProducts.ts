<<<<<<< HEAD
import gpuImg from "@/assets/images/gpu.jpg";
import pcBuild1 from "@/assets/images/pc-build-1.jpg";
import pcBuild2 from "@/assets/images/pc-build-2.jpg";
import pcBuild3 from "@/assets/images/pc-build-3.jpg";
import pcBuild4 from "@/assets/images/pc-build-4.jpg";
=======
import gpuImg from "@/assets/gpu.jpg";
import pcBuild1 from "@/assets/pc-build-1.jpg";
import pcBuild2 from "@/assets/pc-build-2.jpg";
import pcBuild3 from "@/assets/pc-build-3.jpg";
import pcBuild4 from "@/assets/pc-build-4.jpg";
>>>>>>> 152952804887ba31cda745f114c3e5e76a0729a8

export interface MarketplaceProduct {
  slug: string;
  name: string;
  category: string;
  price: string; // starting / reference price shown on cards
  brand: string;
  img: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
}

export const marketplaceProducts: MarketplaceProduct[] = [
  {
    slug: "neon-vanguard-x-1",
    name: "Neon Vanguard X-1",
    category: "Complete Builds",
    price: "$2,499",
    brand: "Buildera",
    img: pcBuild1,
    description:
      "A flagship-class build engineered for 4K gaming and creative workloads. The Neon Vanguard X-1 pairs top-tier silicon with whisper-quiet cooling in a curated chassis.",
    features: [
      "4K ultra gaming ready",
      "Liquid-cooled CPU and GPU airflow",
      "Tool-less upgrade path",
      "Tempered glass side panel",
    ],
    specs: {
      CPU: "Intel Core i9-14900K",
      GPU: "NVIDIA RTX 4080 Super 16GB",
      RAM: "32GB DDR5 6000MHz",
      Storage: "2TB NVMe Gen4 SSD",
      PSU: "850W 80+ Gold",
      Cooling: "360mm AIO",
    },
  },
  {
    slug: "nvidia-rtx-4080-super",
    name: "NVIDIA RTX 4080 Super",
    category: "GPUs",
    price: "$999",
    brand: "NVIDIA",
    img: gpuImg,
    description:
      "The RTX 4080 Super delivers next-gen ray tracing and DLSS 3.5 performance for high-refresh 4K gameplay and accelerated content creation.",
    features: [
      "Ada Lovelace architecture",
      "DLSS 3.5 with frame generation",
      "4th-gen Ray Tracing cores",
      "AV1 encoding support",
    ],
    specs: {
      "CUDA Cores": "10240",
      VRAM: "16GB GDDR6X",
      "Memory Bus": "256-bit",
      "Boost Clock": "2.55 GHz",
      TDP: "320W",
      Outputs: "3x DP 1.4a, 1x HDMI 2.1",
    },
  },
  {
    slug: "alpine-mini-pro",
    name: "Alpine Mini Pro",
    category: "Complete Builds",
    price: "$1,299",
    brand: "Buildera",
    img: pcBuild2,
    description:
      "A compact powerhouse that fits anywhere without compromising on 1440p performance. Ideal for desk-friendly setups and content creators on the go.",
    features: [
      "Small form factor design",
      "Quiet acoustic profile",
      "1440p high-refresh gaming",
      "VESA mount compatible",
    ],
    specs: {
      CPU: "AMD Ryzen 7 7700X",
      GPU: "NVIDIA RTX 4070",
      RAM: "16GB DDR5 5600MHz",
      Storage: "1TB NVMe Gen4 SSD",
      PSU: "650W 80+ Gold SFX",
      Cooling: "240mm AIO",
    },
  },
  {
    slug: "strix-geforce-4090",
    name: "Strix GeForce 4090",
    category: "Complete Builds",
    price: "$3,199",
    brand: "Buildera",
    img: pcBuild3,
    description:
      "An enthusiast-tier showcase build with the flagship RTX 4090, designed for uncompromised 4K/8K gaming, AI workloads, and 3D rendering.",
    features: [
      "RTX 4090 flagship GPU",
      "Custom RGB lighting",
      "Premium cable management",
      "8K-ready outputs",
    ],
    specs: {
      CPU: "Intel Core i9-14900KS",
      GPU: "NVIDIA RTX 4090 24GB",
      RAM: "64GB DDR5 6400MHz",
      Storage: "4TB NVMe Gen4 SSD",
      PSU: "1000W 80+ Platinum",
      Cooling: "420mm AIO",
    },
  },
  {
    slug: "neon-strike",
    name: "Neon Strike",
    category: "Complete Builds",
    price: "$1,899",
    brand: "Buildera",
    img: pcBuild4,
    description:
      "A balanced enthusiast build tuned for high-refresh 1440p esports and AAA titles. Bold neon aesthetics meet rock-solid thermal performance.",
    features: [
      "240Hz esports ready",
      "Vertical GPU mount",
      "Addressable RGB fans",
      "Sound-dampened chassis",
    ],
    specs: {
      CPU: "AMD Ryzen 7 7800X3D",
      GPU: "NVIDIA RTX 4070 Ti Super",
      RAM: "32GB DDR5 6000MHz",
      Storage: "2TB NVMe Gen4 SSD",
      PSU: "750W 80+ Gold",
      Cooling: "280mm AIO",
    },
  },
  {
    slug: "amd-ryzen-9-7950x3d",
    name: "AMD Ryzen 9 7950X3D",
    category: "CPUs",
    price: "$549",
    brand: "AMD",
    img: gpuImg,
    description:
      "16 cores of Zen 4 with 3D V-Cache for unbeatable gaming and productivity performance. The ultimate hybrid creator/gamer chip.",
    features: [
      "3D V-Cache technology",
      "16 cores / 32 threads",
      "AM5 socket platform",
      "PCIe 5.0 ready",
    ],
    specs: {
      Cores: "16",
      Threads: "32",
      "Base Clock": "4.2 GHz",
      "Boost Clock": "5.7 GHz",
      Cache: "144MB total",
      TDP: "120W",
    },
  },
  {
    slug: "corsair-vengeance-64gb",
    name: "Corsair Vengeance 64GB",
    category: "RAM",
    price: "$189",
    brand: "Corsair",
    img: gpuImg,
    description:
      "High-capacity DDR5 kit tuned for modern Intel and AMD platforms. Ideal for creators, streamers, and heavy multitaskers.",
    features: [
      "DDR5 high-bandwidth memory",
      "On-die ECC",
      "Low-profile heat spreader",
      "XMP 3.0 / EXPO support",
    ],
    specs: {
      Capacity: "64GB (2x32GB)",
      Speed: "5600 MHz",
      Latency: "CL40",
      Voltage: "1.25V",
      Profile: "XMP 3.0",
      Form: "DIMM",
    },
  },
  {
    slug: "samsung-990-pro-2tb",
    name: "Samsung 990 Pro 2TB",
    category: "Storage",
    price: "$179",
    brand: "Samsung",
    img: gpuImg,
    description:
      "Flagship PCIe Gen4 NVMe SSD with class-leading sequential speeds and endurance. Perfect for next-gen gaming and creative pipelines.",
    features: [
      "PCIe Gen4 x4 interface",
      "Up to 7,450 MB/s read",
      "DirectStorage optimized",
      "Nickel-coated controller",
    ],
    specs: {
      Capacity: "2TB",
      Interface: "PCIe Gen4 x4",
      "Read Speed": "7,450 MB/s",
      "Write Speed": "6,900 MB/s",
      Endurance: "1,200 TBW",
      Form: "M.2 2280",
    },
  },
];

export const getProductBySlug = (slug: string) =>
  marketplaceProducts.find((p) => p.slug === slug);
