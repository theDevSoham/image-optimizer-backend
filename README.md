
# Image Optimizer

An image optimization backend for uploading bulk image optimized for performance over quality.


## API Reference

#### Upload csv

```http
  POST /api/upload
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `file` | `multipart/form-data` | **Required**. CSV File to upload |

Returns
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `requestId` | `string` | Job id |

#### Check status

```http
  GET /api/status/${requestId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `requestId`      | `string` | **Required**. Id of Job |


## Documentation

### LLD
[Documentation](https://docs.google.com/document/d/1bi31a-pzL_1voVAutPpwm9BIsKzIsTUnrVno5y-lIqg/edit?tab=t.0)

### Database Schema
[Documentation](https://docs.google.com/document/d/1bi31a-pzL_1voVAutPpwm9BIsKzIsTUnrVno5y-lIqg/edit?tab=t.qsqddwwz9l8s)

### Postman Collection
[Postman Documentation](https://documenter.getpostman.com/view/24589212/2sAYdoFnTr)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URI`

`PORT`

`ACCEPTED_FILES`

`CLOUDINARY_CLOUD_NAME`

`CLOUDINARY_API_KEY`

`CLOUDINARY_API_SECRET`



## Installation

Install this project with pnpm

```bash
  pnpm install
```
    