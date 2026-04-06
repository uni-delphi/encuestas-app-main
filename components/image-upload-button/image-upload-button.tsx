"use client"
import { CldUploadButton } from 'next-cloudinary';

export default function ImageUploadButton() {
  return (
    <CldUploadButton uploadPreset="<Upload Preset>" />
  )
}
