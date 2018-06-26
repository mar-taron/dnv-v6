<template>
  <select>
    <slot></slot>
  </select>
</template>

<script>
require('select2');
module.exports = {
  name: 'select',
  props: ['options', 'value', 'reloadable'],
  mounted () {
	  console.log('mounting component:');
	  console.log(this.options);
		var vm = this
		$(this.$el)
			.val(this.value)
			// init select2
			.select2({
        data: this.options,
        minimumResultsForSearch: 10
      }).on('change', function (e) {
					if(this.options['selectedIndex'] != -1){
						var selected = this.options[this.options['selectedIndex']].innerText
						var orderby = this.options[this.options['selectedIndex']].value
						vm.$emit('pagecount', selected)
						vm.$emit('orderbycolumn', orderby)
						vm.$emit('selectvalue', selected)
                        console.log('aaaaaaaaaaaaaaaaa');
                        console.log(selected);
				}
				vm.$emit('input', this.value)
			})
	},
  watch: {
		value (value) {
 			// update value
			$(this.$el).val(value)

            //this part of code react on changing v-model of selects which are reloadable
            if (this.reloadable) {
                var vm = this
                 if (this.value == this.options[0].id ) {
                    $(this.$el).val(this.options[0].id).select2({data: this.options, minimumResultsForSearch: 10});
                }
             }

        },
		options (options) {
			// update options
			$(this.$el).select2({ data: options })
		}
  },
  destroyed () {
		$(this.$el).off().select2('destroy')
  }
}
</script>

<style>
	select {
	  min-width: 180px;
	  width: 100%;
	}
</style>
