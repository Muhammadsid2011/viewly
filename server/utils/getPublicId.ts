function getPublicId(url: string) {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename.substring(0, filename.lastIndexOf("."));
}

export default getPublicId;