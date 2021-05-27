<template>
  <form action="#" method="post">
    <div class="form-group">
      <label for="username" class="required">Username</label>
      <input type="text" class="form-control" id="username" placeholder="Username" required="required">
    </div>
    <div class="form-group">
      <label for="password" class="required">Password</label>
      <input type="password" class="form-control" id="password" placeholder="Password" required="required">
    </div>
    <input class="btn btn-primary btn-block" type="submit" value="Log in" />
  </form>
</template>
<script>
export default {
    
}
</script>