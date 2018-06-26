<template>
	<div class="container-fluid bg-color">
		<div class="row">
			<div class="heading">
				<time-display></time-display>
				<ol class="breadcrumb">
					<li class="breadcrumb-item">
						<a>Client</a>
					</li>
					<li class="breadcrumb-item active">Billing</li>
				</ol>
				<h1 class="page-header">Paymant Method</h1>
				<div class="row">
				<div class="col-lg-2 col-md-3 col-sm-3 col-xs-7 pad-left">
					<button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-primary btn-mar btn-info">
						<span class="dnl_icon dnl_add"></span> Add New Card
					</button>
					<!-- Modal -->
  					<div class="modal fade" id="myModal" role="dialog">
    					<div class="modal-dialog">
    
      					<!-- Modal content-->
      					<div class="modal-content">
       					 <div class="modal-header">
          					<button type="button" class="close" data-dismiss="modal">&times;</button>
         					 <h4 class="modal-title">Add new Card</h4>
        					</div>
       						 <div class="modal-body">
          					<div class="row">
          						<div class="col-sm-6 col-xs-12">
          							<p>First name: </p>
          							<input class="inp-field" type="text" name="">
          						</div>
          						<div class="col-sm-6 col-xs-12">
          							<p>Last name: </p>
          							<input class="inp-field" type="text" name="">
          						</div>
          						<div class="col-sm-12 col-xs-12">
          							<p>Company name: </p>
          							<input class="inp-field" type="text" name="">
          						</div>
          						<div class="col-sm-12 col-xs-12">
          							<p>Adress: </p>
          							<input class="inp-field" type="text" name="">
          						</div>
          						<div class="col-sm-12 col-xs-12">
          						<p></p>
          							<input class="inp-field" type="text" name="">
          						</div>
          						<div class="col-sm-4 col-xs-12">
          							<p>City: </p>
          							<input class="inp-field" type="text" name="">
          						</div>
          						<div class="col-sm-4 col-xs-12">
          						<p>State: </p>
          							<select class="inp-field modified-select-field" :options="options1" v-model="selected1">US</select>
          						</div>
          						<div class="col-sm-4 col-xs-12">
          							<p>ZIP: </p>
          							<input class="inp-field" type="text" name="">
          						</div>
          						<div class="col-sm-12 col-xs-12">
          							<p>Card Number: </p>
          							<input class="inp-field" type="text" name="">
          						</div>
          						<div class="col-sm-8 col-xs-12">
          							<div class="col-sm-6 col-xs-6 pad-left">
          								<p>Expiration Date: </p>
          							<select class="inp-field modified-select-field" :options="options1" v-model="selected1">US</select>
          							</div>
          							<div class="col-sm-6 col-xs-6 pad-right">
          							<p class="p-hide">Expiration Date:</p>
          							<select class="inp-field modified-select-field" :options="options1" v-model="selected1">US</select>
          							</div>
          						</div>
          						<div class="col-sm-4 col-xs-12">
          							<p>Card Code: </p>
          							<input class="inp-field" type="text" name="">
          						</div>
          					</div>
        					</div>
        					<div class="modal-footer">
          					<button type="button" class="btn btn-primary pad-left"><span class="dnl_icon dnl_add"></span>Add Credit Card</button>
       					 </div>
      					</div>
      
    					</div>
 					 </div>
				</div>
				</div>
			</div>
		</div>
		<div id="pad-contaider" class="container-fluid pad-bott">
			<div id="no-pad-top" class="main-content">
				<div class="row">
					<div class="col-md-8 p0r">
						<div class="content first pad mar-first bg-color">
							<h1>Method</h1>
							<p>The minimum amont when adding credit is $25.00:</p>
							<input type="text" placeholder="$25.00"><br>
							<input type="radio" checked="checked" name="" value=""><span class="mar-bot black-color">PayPal</span><span class="mar-bot gray"> ( All Paypal related fees will be duducted from your payment. Pay by credit card using PayPal. ) </span>
							<br>
							<input type="radio" name="" value=""><span class="black-color mar-bot">Credit Card</span><span class="mar-bot gray"> ( All Credit Card related fees will be duducted from your payment. Pay by credit card using Credit Card. ) </span>
							<br>
							<div class="col-lg-3 col-md-5 col-sm-3 pad-right pad-left mar-top-btn">
								<button class="btn btn-primary">Make payment</button>
							</div>
						</div>
					</div>
					<div class="col-md-4 p0l">
						<div class="content second mar pad bg-color">
							<h1><span class="red">%533.62</span></h1>
							<input type="checkbox" name="" value=""><span class="mar-bot black-color">Auto recharge my Account when my balance falls</span>
							<br>
							<div class="row">
								<p class="black-color">Balance <span class="inline-select"><select :options="options1" v-model="selected1" class="inline-block modified-select-field">
						</select></span> recharge for <span class="inline-select"><select style="min-width: 100%!important;" :options="options1" v-model="selected1" class="inline-block">
						</select></span></p>
							</div>
							<input type="checkbox" name="" value=""><span class="mar-bot black-color">Send me Low Balance Notifications</span><br>
							<div class="col-lg-6 col-md-6 col-sm-3 pad-right pad-left mar-top-btn">
								<button class="btn btn-primary">Update</button>
							</div>
						</div>
					</div>
					<div class="col-md-12 p0t">
						<div class="content mar-third pad bg-color">
							<h1>Default Autoplay Account</h1>
							<p class="black-color">Select Default Autoplay Account:</p>
							<select class="modified-select-field" :options="options1" v-model="selected1">No Default Acount</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
    const vSelect = require('vue!../../main_components/select.vue');
    module.exports = {
        components: {
            'select2': vSelect
        },
        data: function() {
            return {
                user_type: '',
                options1: [
                    { id: 1, text: '10' },
                    { id: 2, text: '20' },
                    { id: 3, text: '30' },
                    { id: 4, text: '50' },
                    { id: 5, text: '100' }
                ],
            }
        },
        components: {
            // 'app-message': appMessage
        },
        created () {
        },
        updated () {
        },
        methods: {
        }
    }
</script>

<style>

.p-hide{
	color: transparent;
}
#myModal > div > div > div.modal-body > div > div > p, 
#myModal > div > div > div.modal-body > div > div.col-sm-8.col-xs-12 > div.col-sm-6.col-xs-6.pad-left > p, 
#myModal > div > div > div.modal-body > div > div.col-sm-8.col-xs-12 > div.col-sm-6.col-xs-6.pad-right > p{
padding-top: 10px;
}
.inp-field{
border: 1px solid #999;
padding: 5px;
width: 100%;
margin-left: 1px;
border-radius: 5px;
}
.modal-content{
	padding: 20px;
}
.modal-dialog{
	width: 75%;
	height: 100%;
	margin: 180px auto;
}
button.close{
	color: black;
}
#pad-contaider{
	margin-top: 15px;
}
.mar-top-bot{
	margin: 10px 0;
}
	.bg-color{
		background: #edeff5;
		height: 100%;
	}
	.heading{
		padding: 15px 15px 0 15px;
	}
	.heading .btn{
		padding: 6px 28px;
	}
	.main-content{
		background: white;
		border: 1px solid lightgray;
		border-radius: 5px;
	}
	.content{
		height: 300px;
	}
	.btn-mar{
		margin-left: 15px;
	}
	.pad{
		padding: 15px;
	}
	.main-content .mar{
		margin: 15px;
	}
	.first input{
		margin-left: 1px;
	}
	.first p,
	.black-color{
		color: black;
		font-weight: bold;
	}
	.mar-first{
		margin: 15px 0 15px 15px;
	}
	.mar-third{
		margin: 0 15px 15px 15px;
	}
	.pad-bott{
		padding-bottom: 30px;
	}
	.p0t{
		padding-top: 0px;
	}
	.inline-select{
		display: inline-block;
		min-width: 80px;
		width: 80px;
		padding-bottom: 5px;
	}
	.red{
		color: red;
	}
	.gray{
		color: #999;
	}
	.mar-bot{
		margin-bottom: 10px!important;
	}
	#pad-contaider > div > div > div.col-md-8.p0r > div > input[type="text"]:nth-child(3),
	#pad-contaider > div > div > div.col-md-4.p0l > div > div > p > span:nth-child(2) > select,
	#pad-contaider > div > div > div.col-md-4.p0l > div > div > p > span:nth-child(1) > select,
	#pad-contaider > div > div > div.col-md-12.p0t > div > select{
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 5px;
	}
	.second p{
		padding: 5px 15px 0px
	}
	@media  (min-width: 1203px) {
		.modal-content{
			padding:90px;
		}
		.modal-dialog{
			width: 45%;
		}
	}
	@media  (max-width: 1203px) and (min-width: 900px) {
		.modal-content{
			padding:50px;
		}
		.modal-dialog{
			width: 50%;
		}
	}
	@media  (max-width: 900px) and (min-width: 768px) {
		.modal-content{
			padding:40px;
		}
		.modal-dialog{
			width: 60%;
		}
	}
	@media (max-width: 991px){
		.p0r{
			padding-right: 15px;
		}
		.p0l{
			padding-left: 15px;
		}
		.mar-first, .mar-third{
			margin: 15px;
		}
	}
	@media (max-width: 425px){
		.content{
			height: 100%;
		}
		.content h1{
			font-size: 23px;
		}
	}
	#pad-contaider{
		padding-left: 0px!important;
		padding-right: 0px!important;
	}
</style>
