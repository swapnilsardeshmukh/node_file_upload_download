var config = {
    //mntdir: '/mnt/efs/edge', // 'C:/\Bhavesh/\efs/\edge'
    db: {
        user: "postgres",
        host: "localhost",
        database: "postgres",
        password: "root",
        port: 5432,
        multipleStatements: true
        /*Mysql
        // host: 'illumedev.cpbhlvrso7ht.ap-south-1.rds.amazonaws.com',
        host: 'ec2-43-204-81-10.ap-south-1.compute.amazonaws.com', //New Dev  
        user: 'edgedev', //'moodles',
        password: 'mobdb1234',
        // database: 'illumeDev', //devDB
        database: 'production_replica_v1',
        multipleStatements: true,
        port: '3306',
        connectTimeout: 100000,
        */
    },
    s3: {
        bucket: '*********',
        permission: 'public-read',
        accesskey: '******',
        secretkey: '*************',

	acl: {
            private: 'private',
            public: 'public-read'
        },
    },
    
};


module.exports = config;
