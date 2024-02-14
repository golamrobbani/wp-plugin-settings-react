# Wp Plugin Boilerplate React Js With  wp-scripts  And Composer Autoload Php

***Please Change this base on your plugin***

* ```namespace TinySolutions\boilerplate```
* ```Prefix BPR_ ```

```
And also Check if necessery change need

define('BPR_VERSION', '0.0.1');
define('BPR_FILE', __FILE__);
define('BPR_BASENAME', plugin_basename(BPR_FILE));
define('BPR_URL', plugins_url('', BPR_FILE));
define('BPR_ABSPATH', dirname(BPR_FILE));
define( 'BPR_PATH', plugin_dir_path(BPR_FILE ) );
```

***Composer Command***

* ```composer install``` 
* ```composer dumpautoload -o ```

***Js Compiler wp-scripts***

* ```yarn install``` OR ```npm run install```  To install package 
* ```yarn start``` OR ```npm run start``` to compile js file
* ```yarn zip``` OR ```npm run zip``` to create a package with production zip file ready




* Using Context api and reducer 
* Using antd, axios, toastr. You can add or remove if you need
* Use dispatch for update state value  

```
dispatch({
    type: Types.GENERAL_DATA,
    generalData:{
        ...stateValue.generalData,
        selectedMenu : key
    }
});
```
