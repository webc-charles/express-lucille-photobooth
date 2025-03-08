const { S3Client, ListObjectsCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const config = require('../config/aws');

const s3Client = new S3Client({
    region: config.region,
    credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
    }
});

class S3Service {
    async getImages() {
        const command = new ListObjectsCommand({
            Bucket: config.bucket
        });
        
        const data = await s3Client.send(command);

        const images = await Promise.all(data.Contents.map(async (item) => {
            const url = await this.getPresignedUrl(item.Key);
            return {
                url,
                key: item.Key
            };
        }));
        
        return images;
    }

    async getPresignedUrl(key) {
        const command = new GetObjectCommand({
            Bucket: config.bucket,
            Key: key
        });
        
        // URL expires in 24 hours (86400 seconds)
        return await getSignedUrl(s3Client, command, { expiresIn: 86400 });
    }
}

module.exports = new S3Service();
