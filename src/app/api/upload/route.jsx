import crypto from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sign = (params, apiSecret) => {
    const toSign = Object.keys(params)
        .sort()
        .filter((k) => params[k] !== undefined && params[k] !== "")
        .map((k) => `${k}=${params[k]}`)
        .join("&");
    return crypto
        .createHash("sha1")
        .update(toSign + apiSecret)
        .digest("hex");
};

export async function POST(request) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "uploads";

    if (!cloudName || !apiKey || !apiSecret) {
        return NextResponse.json(
            { success: false, message: "Cloudinary env vars are missing" },
            { status: 500 },
        );
    }

    const incoming = await request.formData();
    const file = incoming.get("file");
    if (!file || typeof file === "string") {
        return NextResponse.json(
            { success: false, message: "No file uploaded" },
            { status: 400 },
        );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signedParams = { folder, timestamp };
    const signature = sign(signedParams, apiSecret);

    const mime = (file.type || "").toLowerCase();
    const name = (file.name || "").toLowerCase();
    const isImage = mime.startsWith("image/");
    const isPdf = mime === "application/pdf" || name.endsWith(".pdf");
    // PDF dùng resource_type=image để Cloudinary cho phép transform / thumbnail
    const resourceType = isImage || isPdf ? "image" : "raw";
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const upload = new FormData();
    upload.append("file", file);
    upload.append("api_key", apiKey);
    upload.append("timestamp", String(timestamp));
    upload.append("folder", folder);
    upload.append("signature", signature);

    const resp = await fetch(endpoint, { method: "POST", body: upload });
    const data = await resp.json().catch(() => ({}));

    console.log("Cloudinary response:", { status: resp.status, data });

    if (!resp.ok) {
        return NextResponse.json(
            {
                success: false,
                message: data?.error?.message || "Cloudinary upload failed",
                details: data,
            },
            { status: resp.status },
        );
    }

    return NextResponse.json({
        success: true,
        url: data.secure_url || data.url,
        publicId: data.public_id,
        format: data.format,
        bytes: data.bytes,
        resourceType: data.resource_type,
        width: data.width,
        height: data.height,
        originalFilename: data.original_filename,
    });
}
