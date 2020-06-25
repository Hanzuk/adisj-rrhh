<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  height: 100vh;
}

.basic-info {
  margin-top: 30px;
  margin-bottom: 30px;
  padding-top: 20px;
  padding-bottom: 30px;
  box-shadow: 0px -1px 0px 0px #e2e8f0, 0px 1px 0px 0px #e2e8f0;
}

.contact-info,
.credentials-info {
  margin-bottom: 30px;
  padding-bottom: 30px;
  box-shadow: 0px 1px 0px 0px #e2e8f0;
}

.work-info {
  margin-bottom: 30px;
  /* box-shadow: 0px 1px 0px 0px #e2e8f0; */
}

.flex {
  display: flex;
  align-items: center;
}

.mx-0 {
  margin-right: 0;
  margin-left: 0;
}
.mr-1 {
  margin-right: 5px;
}
.mr-2 {
  margin-right: 10px;
}
.ml-1 {
  margin-left: 5px;
}
.ml-2 {
  margin-left: 10px;
}
</style>
