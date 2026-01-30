<?php
namespace phpGrace\caches;

if (!class_exists('phpGrace\caches\fileCacher')) {
    class fileCacher
    {


        // Cache storage directory
        private $cacheDir;
        private static $instance = null;

        public static function getInstance($config = array())
        {
            if (self::$instance == null) {
                self::$instance = new self($config);
            }
            return self::$instance;
        }

        public function __construct($config = array())
        {
            // Store cache files in a subdir to avoid accidental deletion of source files next time
            $this->cacheDir = PG_IN . 'caches' . PG_DS . 'data' . PG_DS;
            if (!is_dir($this->cacheDir)) {
                @mkdir($this->cacheDir, 0777, true);
            }
        }

        public function get($name)
        {
            $file = $this->cacheDir . md5($name) . '.cache';
            if (is_file($file)) {
                $data = unserialize(file_get_contents($file));
                if ($data['expire'] > time()) {
                    return $data['val'];
                } else {
                    @unlink($file);
                    return null;
                }
            }
            return null;
        }

        public function set($name, $val, $expire = 3600)
        {
            $file = $this->cacheDir . md5($name) . '.cache';
            $data = array(
                'expire' => time() + $expire,
                'val' => $val
            );
            return file_put_contents($file, serialize($data));
        }

        public function removeCache($name)
        {
            $file = $this->cacheDir . md5($name) . '.cache';
            if (is_file($file)) {
                @unlink($file);
            }
        }

        public function clearCache()
        {
            $files = scandir($this->cacheDir);
            foreach ($files as $k => $v) {
                if ($v != '.' && $v != '..') {
                    @unlink($this->cacheDir . $v);
                }
            }
        }
    }
}
?>