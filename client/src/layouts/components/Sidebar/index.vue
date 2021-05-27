<template>

  <div class="sidebar" id="sidebar" style="z-index: 10000">
    <!-- Filter section start -->
    <div class="sidebar-menu">
      <div class="sidebar-content">
        <input
          class="form-control search"
          type="text"
          placeholder="Search"
          id="search-repo-input"
        />
        <div class="mt-10 font-size-12 hidden-sm-and-down">
          Press <kbd>shift</kbd> + <kbd>F</kbd> to focus
        </div>
      </div>
    </div>
    <!-- Filter section end -->

    <!-- Filterable list start -->
    <div class="sidebar-menu list">
      <h5 class="sidebar-title">Project Database</h5>
      <div class="sidebar-divider"></div>

      <details class="sidebar-link">
        <summary id="add-general" style="cursor: pointer">
          Create New
          <span
            data-toggle="tooltip"
            data-title="Add new Project, Board Version, Stages, Status data"
            data-placement="right"
            ><i class="fas fa-info-circle text-primary" aria-hidden="true"></i
          ></span>
        </summary>
        <ul class="name">
          <a
            href="#"
            target="blank"
            class="sidebar-link"
            id="sidebar-data-upload"
            >Project</a
          >
          <a
            href="#"
            target="blank"
            class="sidebar-link"
            id="sidebar-data-upload"
            >Board Version</a
          >
          <a
            href="#"
            target="blank"
            class="sidebar-link"
            id="sidebar-data-upload"
            >Stages</a
          >
          <a
            href="#"
            target="blank"
            class="sidebar-link"
            id="sidebar-data-upload"
            >Status</a
          >
        </ul>
      </details>
      <br />

      <a class="sidebar-link active" href="#"
        ><span class="name">Upload</span></a
      >
    </div>
  </div>
</template>

<script>
export default {
    name: "Sidebar"
}
</script>

<style>

</style>