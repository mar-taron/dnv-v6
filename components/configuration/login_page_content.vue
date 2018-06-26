<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Configuration</a></li>
				  <li class="breadcrumb-item active">Login Page Content</li>
			</ol>
			<h1 class="page-header">Login Page Content</h1>
			<div class="white_pad configuration_pad">
				<h3 class="description">You may specify how your Invoice should be generated</h3>
					<div class="col-md-6 col-sm-12">
						<div class="imac_container">
							<div class="editor_preview" v-html="login_page.contentA"></div>
						</div>
						<label>Change Background Image:</label>
						<div class="invoice_bg">
							<dropzone id="myVueDropzone" :url="this.apiUrl" v-on:vdropzone-success="success"></dropzone>
    						<button v-on:click="process" class="btn btn-default">Change Image</button>

    						</br></br>
    						<label>(Only jpeg image)</label>
    						</br></br>
    						<label>The image size should be less then 1 mb.</label>
							<div class="checkbox checkbox-success">
							<input id="fit_to_screen" name="fit_to_screen" type="checkbox" v-model="login_page.fit_to_screen"> <label for="fit_to_screen">Fit image to the screen</label>
							</div>
							<div class="checkbox checkbox-success">
							<input name="use_captcha" v-model="login_page.use_captcha" id="use_captcha" type="checkbox"> <label for="use_captcha">Use captcha</label>
							</div>
						</div>
						<div class="fields">
							<div class="form-group">
								
							</div>
						</div>
					</div>
					<div class="col-md-6 col-sm-12">
						<section class="config_section">
							<label>Login Page Content:</label>
							<ckeditor v-model="login_page.contentA" :minified="false" :id="editorA" :height="'280px'"></ckeditor>
						</section>
						<div class="button_set little-space">
							<a class="btn btn-primary">
								Submit
							</a>
							<a class="btn btn-default" @click="reset">
								Reset
							</a>
					  </div>
					</div>
				<div class="clearfix little-space"></div>
			</div>
		</div>
	  </div>
	</div>
</template>

<script>   
	const Ckeditor = require('vue!../main_components/ckeditor.vue'),
      api = require("../../api"),
    Dropzone = require('vue!../main_components/dropzone.vue'),
		  multiselect = require('multiselect');
	module.exports = {
		components: {
			Ckeditor,
			Dropzone,
			'multiselect': multiselect
		},
		data: function(){
            return {
				 editorA: 'editor-a',
				 contentA: '',
				 fit_to_screen: '',
				 image_url: '',
				 use_captcha: false,
                 apiUrl : api.getEndpointUrl() + '/config/login',
                 reset_login_page: {},
                 login_page: {},
                 login_page_params: {}
            }
        },
		mounted: function() {
			
		},
		methods: {
		  'success': function (file) {
			console.log('A file was successfully uploaded')
		  },
		  'process': function () {
			var newArr = this.$children.filter(function(item){
			  return item.id === "myVueDropzone";
			});

              var component = newArr[0];
              console.log(component);
			component.processQueue()
		  },
		  reset() {
				this.login_page = JSON.parse( JSON.stringify( this.reset_login_page ) )
	      },
		  fetchLoginPage() {
				const url = api.getEndpointUrl() + '/v1/config/login'
				
				this.$http.get(url)
				.then(response => {
					const body = response.body;
					const payload = body.payload;

					if (body.success) {
						Vue.set(this.login_page, 'contentA', payload.content);
						Vue.set(this.login_page, 'fit_to_screen', payload.fit_to_screen);
						Vue.set(this.login_page, 'image_url', payload.image_url);
						Vue.set(this.login_page, 'use_captcha', payload.use_captcha);
						console.log(this.login_page);
						this.reset_login_page = JSON.parse( JSON.stringify( this.login_page ) )
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
		},
		created () {
			this.fetchLoginPage();
		}
	}
</script>

<style>
	.invoice_bg .checkbox-success {
		display: inline-block;
		margin: 4px 0 0 16px;
		vertical-align: middle;
	}
	
	.invoice_bg .btn.btn-default {
		padding-top: 4px;
		line-height: 0px;
	}
	
	.imac_container {
		width: 100%;
		height: 478px;
		background-size: 100% 100%;
		padding: 25px 25px 146px 25px;
		margin-bottom: 20px;
	}
	
	
	
	
	@media (max-width: 1200px) { 
		.imac_container {
			height: 400px;
		}
	}
	
	
	@media (min-width: 768px) and (max-width: 979px) {
		.imac_container {
			height: 600px;
			padding: 32px 39px 186px 39px;
		}
	}
	
	@media (max-width: 767px) {
		.imac_container {
			height: 280px;
		}
	}
	@media (max-width: 572px) and (min-width: 480px){
	.invoice_bg .checkbox-success{
		display: block;
		padding: 10px;
		}
	}
	/* Landscape phones and down */
	@media (max-width: 480px) {
		.imac_container {
			height: 250px;
			padding: 15px 15px 76px 15px;
		}
		
		.invoice_bg .checkbox-success {
			display: block;
			margin: 20px 0 0 0px;
		}
	}

	/* Portrait phone to landscape phone */
	@media (min-width: 319px) and (max-width: 479px) {
		
	}
</style>
