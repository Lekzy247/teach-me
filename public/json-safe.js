// Teach Me response safety layer.
// Prevents cryptic "Unexpected token" errors when a hosting platform returns
// plain text or HTML instead of JSON. Load this before app.js.
const originalText = Response.prototype.text;

Response.prototype.json = async function safeJson() {
  const text = await originalText.call(this);
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    const compact = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return {
      error: compact || `Server returned a non-JSON response (${this.status})`,
      responseType: this.headers.get('content-type') || 'unknown'
    };
  }
};
