const express = require("express");
const router = express.Router();
const admin_controller = require('../apitest/admin')

// Get Dashboard Data
router.post('/get_dashboard_data',admin_controller.get_ttt_dashboard);
router.post('/get_pg_data_query',admin_controller.get_pg_data_query);
router.post('/get_pg_data_que_func',admin_controller.get_pg_data_func);
router.post('/get_pg_data_que_sp',admin_controller.get_pg_data_sp);
router.post('/upload',admin_controller.uploadFile);
router.post('/multiUpload',admin_controller.uploadMultipleFiles);
router.post('/uploadFileAsyncAwaitWay',admin_controller.uploadFileAsyncAwaitWay);
router.post('/uploadMultiFileAsyncAwaitWay',admin_controller.uploadMultiFileAsyncAwaitWay);
router.post('/uploadFileAndThenMoveToS3',admin_controller.uploadFileAndThenMoveToS3);











module.exports = router;