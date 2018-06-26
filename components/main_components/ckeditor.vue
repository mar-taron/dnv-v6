<template>
	<div class="ckeditor">
		<textarea :id="id" :value="value"></textarea>
	</div>
</template>
<script>
module.exports = {
	props: {
	  value: {
			type: String
  	},

	  minified: {
	   	type: Boolean,
		default: false
	  },

	  id: {
			type: String,
			default: 'editor'
	  },
	  height: {
			type: String,
			default: '200px',
	  },
	  language: {
			type: String,
			default: 'en'
	  },
	  extraplugins: {
			type: String,
			default: ''
	  },
		toolbar: {
      type: Array,
      default: () => [
				[ 'Source','-','Save','NewPage','DocProps','Preview','Print','-','Templates' ],
				[ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ],
				[ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ],
				[ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ],
				'/',
				[ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ],
				[ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ],
				[ 'Link','Unlink','Anchor' ],
				[ 'Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak' ],
				'/',
				[ 'Styles','Format','Font','FontSize' ],
				[ 'TextColor','BGColor' ],
				[ 'Maximize', 'ShowBlocks','-','About' ]
			]
    },

        toolbarMini: {
            type: Array,
            default: () => [
                [ 'Styles','Format','Font','FontSize' ],
                [ 'TextColor','BGColor' ],
                [ 'Maximize', 'ShowBlocks','-','About' ]
            ]
        }

    },
	beforeUpdate () {
    const ckeditorId = this.id

    if (this.value !== CKEDITOR.instances[ckeditorId].getData()) {
      CKEDITOR.instances[ckeditorId].setData(this.value)
    }
	},
	mounted () {
    const ckeditorId = this.id
    const ckeditorConfig = {
      toolbar: this.toolbar,
      language: this.language,
      height: this.height,
      extraPlugins: this.extraplugins
    }

    if (this.minified) {
 		ckeditorConfig.toolbar = this.toolbarMini
	}

    CKEDITOR.replace(ckeditorId, ckeditorConfig)
    CKEDITOR.instances[ckeditorId].setData(this.value)
    CKEDITOR.instances[ckeditorId].on('change', () => {
      let ckeditorData = CKEDITOR.instances[ckeditorId].getData()
      if (ckeditorData !== this.value) {
        this.$emit('input', ckeditorData)
      }
    })
	},
	destroyed () {
    const ckeditorId = this.id
		const instance = CKEDITOR.instances[ckeditorId]
    if (instance) {
      instance.destroy()
    }
	}
}
</script>
<style>
.ckeditor {
	width: 100%;
	clear: both;
}
</style>
