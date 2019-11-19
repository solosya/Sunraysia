<?php

function beforePageCache() {
    if (Yii::$app->id == 'app-frontend' && Yii::$app->user->isGuest && Yii::$app->controller->id == 'article') {
        $themeConfig = (new \sdk\frontend\Network())->getThemeConfig();
        if (isset($themeConfig['allowedReferrers']) && isset($_SERVER['HTTP_REFERER'])) {
            foreach($themeConfig['allowedReferrers'] as $ar) {
                if ($ar == parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST)) {
                    return false;
                }
            }
        }
    }
    return true;
}

