# PixelPerfect AI API Documentation

This document provides comprehensive documentation for the PixelPerfect AI API, which allows developers to integrate AI-powered image editing capabilities into their applications.

## Base URL

```
https://api.pixelperfect.ai
```

## Authentication

All API requests require authentication using an API key. You can obtain an API key from your PixelPerfect AI dashboard.

Include your API key in the request headers:

```
X-API-Key: your_api_key_here
```

## Rate Limiting

The API is rate-limited to protect our services from abuse. Rate limits vary by subscription tier:

- **Free**: 10 requests per minute, 100 requests per day
- **Pro**: 60 requests per minute, 1,000 requests per day
- **Max**: 300 requests per minute, 10,000 requests per day

Rate limit headers are included in all API responses:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1620000000
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request. In case of an error, the response body will contain a JSON object with an error message:

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "The API key provided is invalid or has expired."
  }
}
```

Common error codes:

- `400 Bad Request`: The request was malformed or missing required parameters
- `401 Unauthorized`: Invalid or missing API key
- `403 Forbidden`: The API key doesn't have permission to perform the requested action
- `404 Not Found`: The requested resource doesn't exist
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: An error occurred on the server

## API Endpoints

### Image Processing

#### Remove Background

Removes the background from an image, isolating the subject.

**Endpoint:** `POST /image/remove-background`

**Content-Type:** `multipart/form-data`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| file | File | Yes | The image file to process |
| refinement | String | No | Refinement level: 'auto', 'high', 'medium', 'low'. Default: 'auto' |
| format | String | No | Output format: 'png', 'jpg', 'webp'. Default: 'png' |
| size | String | No | Output size: 'original', 'preview'. Default: 'original' |
| returnType | String | No | Return type: 'url', 'base64'. Default: 'url' |

**Example Request:**

```bash
curl -X POST https://api.pixelperfect.ai/image/remove-background \
  -H "X-API-Key: your_api_key_here" \
  -F "file=@image.jpg" \
  -F "refinement=high" \
  -F "format=png"
```

**Example Response:**

```json
{
  "success": true,
  "result": {
    "url": "https://storage.pixelperfect.ai/processed/bg_removed_12345.png",
    "width": 1024,
    "height": 768,
    "size": 245678,
    "format": "png"
  }
}
```

#### Enhance Image

Applies AI-powered enhancements to improve image quality.

**Endpoint:** `POST /image/enhance`

**Content-Type:** `multipart/form-data`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| file | File | Yes | The image file to process |
| enhancement | String | No | Enhancement type: 'auto', 'portrait', 'product', 'landscape'. Default: 'auto' |
| format | String | No | Output format: 'jpg', 'png', 'webp'. Default: 'jpg' |
| quality | String | No | Output quality: 'high', 'medium', 'low'. Default: 'high' |
| returnType | String | No | Return type: 'url', 'base64'. Default: 'url' |

**Example Request:**

```bash
curl -X POST https://api.pixelperfect.ai/image/enhance \
  -H "X-API-Key: your_api_key_here" \
  -F "file=@image.jpg" \
  -F "enhancement=portrait" \
  -F "quality=high"
```

**Example Response:**

```json
{
  "success": true,
  "result": {
    "url": "https://storage.pixelperfect.ai/processed/enhanced_12345.jpg",
    "width": 1024,
    "height": 768,
    "size": 345678,
    "format": "jpg"
  }
}
```

#### Apply Filter

Applies a filter to an image.

**Endpoint:** `POST /image/filter`

**Content-Type:** `multipart/form-data`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| file | File | Yes | The image file to process |
| filter | String | Yes | Filter ID to apply |
| intensity | Number | No | Filter intensity (0.0 to 1.0). Default: 1.0 |
| format | String | No | Output format: 'jpg', 'png', 'webp'. Default: 'jpg' |
| returnType | String | No | Return type: 'url', 'base64'. Default: 'url' |

**Example Request:**

```bash
curl -X POST https://api.pixelperfect.ai/image/filter \
  -H "X-API-Key: your_api_key_here" \
  -F "file=@image.jpg" \
  -F "filter=vintage" \
  -F "intensity=0.8"
```

**Example Response:**

```json
{
  "success": true,
  "result": {
    "url": "https://storage.pixelperfect.ai/processed/filtered_12345.jpg",
    "width": 1024,
    "height": 768,
    "size": 298765,
    "format": "jpg",
    "filter": "vintage",
    "intensity": 0.8
  }
}
```

#### Apply Adjustments

Applies custom adjustments to an image.

**Endpoint:** `POST /image/adjust`

**Content-Type:** `multipart/form-data`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| file | File | Yes | The image file to process |
| brightness | Number | No | Brightness adjustment (-100 to 100). Default: 0 |
| contrast | Number | No | Contrast adjustment (-100 to 100). Default: 0 |
| saturation | Number | No | Saturation adjustment (-100 to 100). Default: 0 |
| blur | Number | No | Blur adjustment (0 to 100). Default: 0 |
| format | String | No | Output format: 'jpg', 'png', 'webp'. Default: 'jpg' |
| quality | String | No | Output quality: 'high', 'medium', 'low'. Default: 'high' |
| returnType | String | No | Return type: 'url', 'base64'. Default: 'url' |

**Example Request:**

```bash
curl -X POST https://api.pixelperfect.ai/image/adjust \
  -H "X-API-Key: your_api_key_here" \
  -F "file=@image.jpg" \
  -F "brightness=10" \
  -F "contrast=20" \
  -F "saturation=5"
```

**Example Response:**

```json
{
  "success": true,
  "result": {
    "url": "https://storage.pixelperfect.ai/processed/adjusted_12345.jpg",
    "width": 1024,
    "height": 768,
    "size": 312456,
    "format": "jpg",
    "adjustments": {
      "brightness": 10,
      "contrast": 20,
      "saturation": 5,
      "blur": 0
    }
  }
}
```

#### Batch Processing

Process multiple images with the same settings.

**Endpoint:** `POST /image/batch`

**Content-Type:** `multipart/form-data`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| file0, file1, ... | Files | Yes | The image files to process |
| settings | JSON | Yes | JSON string with processing settings |

**Example Request:**

```bash
curl -X POST https://api.pixelperfect.ai/image/batch \
  -H "X-API-Key: your_api_key_here" \
  -F "file0=@image1.jpg" \
  -F "file1=@image2.jpg" \
  -F 'settings={"removeBackground":true,"autoEnhance":true,"filter":"none"}'
```

**Example Response:**

```json
{
  "success": true,
  "results": [
    {
      "originalName": "image1.jpg",
      "url": "https://storage.pixelperfect.ai/processed/batch_12345_0.png",
      "width": 1024,
      "height": 768,
      "size": 245678,
      "format": "png"
    },
    {
      "originalName": "image2.jpg",
      "url": "https://storage.pixelperfect.ai/processed/batch_12345_1.png",
      "width": 800,
      "height": 600,
      "size": 198765,
      "format": "png"
    }
  ]
}
```

### Advanced Image Processing

#### Upscale Image

Upscales an image using AI to increase resolution while maintaining quality.

**Endpoint:** `POST /image/advanced/upscale`

**Content-Type:** `multipart/form-data`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| file | File | Yes | The image file to process |
| scale | Number | No | Scale factor: 2, 3, or 4. Default: 2 |
| model | String | No | Upscaling model: 'standard', 'hd'. Default: 'standard' |
| format | String | No | Output format: 'jpg', 'png', 'webp'. Default: 'jpg' |
| returnType | String | No | Return type: 'url', 'base64'. Default: 'url' |

**Example Request:**

```bash
curl -X POST https://api.pixelperfect.ai/image/advanced/upscale \
  -H "X-API-Key: your_api_key_here" \
  -F "file=@image.jpg" \
  -F "scale=4" \
  -F "model=hd"
```

**Example Response:**

```json
{
  "success": true,
  "result": {
    "url": "https://storage.pixelperfect.ai/processed/upscaled_12345.jpg",
    "width": 4096,
    "height": 3072,
    "size": 1245678,
    "format": "jpg",
    "scale": 4,
    "model": "hd"
  }
}
```

#### Smart Crop

Intelligently crops an image to focus on the important content.

**Endpoint:** `POST /image/advanced/smart-crop`

**Content-Type:** `multipart/form-data`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| file | File | Yes | The image file to process |
| width | Number | Yes | Target width in pixels |
| height | Number | Yes | Target height in pixels |
| focusOn | String | No | Focus on: 'auto', 'face', 'product'. Default: 'auto' |
| format | String | No | Output format: 'jpg', 'png', 'webp'. Default: 'jpg' |
| returnType | String | No | Return type: 'url', 'base64'. Default: 'url' |

**Example Request:**

```bash
curl -X POST https://api.pixelperfect.ai/image/advanced/smart-crop \
  -H "X-API-Key: your_api_key_here" \
  -F "file=@image.jpg" \
  -F "width=800" \
  -F "height=800" \
  -F "focusOn=face"
```

**Example Response:**

```json
{
  "success": true,
  "result": {
    "url": "https://storage.pixelperfect.ai/processed/cropped_12345.jpg",
    "width": 800,
    "height": 800,
    "size": 198765,
    "format": "jpg",
    "focusOn": "face"
  }
}
```

### Storage

#### Upload Image

Uploads an image to cloud storage.

**Endpoint:** `POST /storage/upload`

**Content-Type:** `multipart/form-data`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| file | File | Yes | The image file to upload |
| title | String | No | Image title |
| description | String | No | Image description |
| tags | String | No | Comma-separated tags |
| folder | String | No | Folder path |

**Example Request:**

```bash
curl -X POST https://api.pixelperfect.ai/storage/upload \
  -H "X-API-Key: your_api_key_here" \
  -F "file=@image.jpg" \
  -F "title=My Image" \
  -F "tags=vacation,beach"
```

**Example Response:**

```json
{
  "success": true,
  "image": {
    "id": "img_12345",
    "url": "https://storage.pixelperfect.ai/user/12345/image.jpg",
    "title": "My Image",
    "description": "",
    "tags": ["vacation", "beach"],
    "width": 1024,
    "height": 768,
    "size": 245678,
    "format": "jpg",
    "createdAt": "2023-05-01T12:34:56Z"
  }
}
```

#### Get User Images

Retrieves a list of user's stored images.

**Endpoint:** `GET /storage/images`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| page | Number | No | Page number. Default: 1 |
| limit | Number | No | Items per page. Default: 20 |
| sortBy | String | No | Sort by: 'createdAt', 'title', 'size'. Default: 'createdAt' |
| sortOrder | String | No | Sort order: 'asc', 'desc'. Default: 'desc' |
| folder | String | No | Filter by folder |
| tags | String | No | Filter by tags (comma-separated) |

**Example Request:**

```bash
curl -X GET "https://api.pixelperfect.ai/storage/images?page=1&limit=10&sortBy=createdAt&sortOrder=desc" \
  -H "X-API-Key: your_api_key_here"
```

**Example Response:**

```json
{
  "success": true,
  "images": [
    {
      "id": "img_12345",
      "url": "https://storage.pixelperfect.ai/user/12345/image1.jpg",
      "title": "Beach Sunset",
      "tags": ["vacation", "beach"],
      "width": 1024,
      "height": 768,
      "size": 245678,
      "format": "jpg",
      "createdAt": "2023-05-01T12:34:56Z"
    },
    {
      "id": "img_12346",
      "url": "https://storage.pixelperfect.ai/user/12345/image2.jpg",
      "title": "Mountain View",
      "tags": ["vacation", "mountains"],
      "width": 1200,
      "height": 800,
      "size": 345678,
      "format": "jpg",
      "createdAt": "2023-04-28T10:12:34Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

## Webhooks

PixelPerfect AI supports webhooks to notify your application when certain events occur. You can configure webhooks in your dashboard.

### Webhook Events

- `image.processed`: Triggered when an image processing job is completed
- `subscription.created`: Triggered when a subscription is created
- `subscription.updated`: Triggered when a subscription is updated
- `subscription.canceled`: Triggered when a subscription is canceled

### Webhook Payload

```json
{
  "event": "image.processed",
  "created": 1620000000,
  "data": {
    "id": "job_12345",
    "status": "completed",
    "result": {
      "url": "https://storage.pixelperfect.ai/processed/enhanced_12345.jpg",
      "width": 1024,
      "height": 768,
      "size": 345678,
      "format": "jpg"
    }
  }
}
```

### Webhook Security

Webhooks include a signature in the `X-Pixelperfect-Signature` header. You should verify this signature to ensure the webhook is from PixelPerfect AI.

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}
```

## SDKs and Client Libraries

We provide official client libraries for several programming languages:

- [JavaScript/TypeScript](https://github.com/pixelperfect-ai/pixelperfect-js)
- [Python](https://github.com/pixelperfect-ai/pixelperfect-python)
- [PHP](https://github.com/pixelperfect-ai/pixelperfect-php)
- [Ruby](https://github.com/pixelperfect-ai/pixelperfect-ruby)

## Support

If you have any questions or need assistance, please contact our support team at support@pixelperfect.ai or visit our [documentation](https://docs.pixelperfect.ai).

