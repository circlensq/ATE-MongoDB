<template>
    <div class="page-wrapper with-navbar with-sidebar with-transitions" data-sidebar-type="overlayed-sm-and-down" data-sidebar-shortcut-enabled="true">
        <Navbar />
        <Sidebar />
    </div>
</template>

<script>
import { Navbar, Sidebar } from './components'

export default {
    name: 'Layouts',
    components: {
        Navbar,
        Sidebar
    }
}
</script>

<style>

</style>