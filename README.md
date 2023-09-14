# Wp Plugin Boilerplate React Js With Mix And Composer Autoload Php

***Composer Command***

* ```composer install``` 
* ```composer dumpautoload -o ```

***Js Compiler Laravel mix***

* ```yarn install``` OR ```npm run install```  To install package 
* ```yarn watch``` OR ```npm run watch``` to compile js file
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
