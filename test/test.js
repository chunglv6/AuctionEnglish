 

let Auction = artifacts.require('./Auction.sol');

 

let auctionInstance;

 

contract('AuctionContract', function(accounts) {

  //accounts[0] is the default account

  describe('Contract deployment', function() {

    it('Contract deployment', function() {

      //Fetching the contract instance of our smart contract

      return Auction.deployed().then(function(instance) {

        //We save the instance in a global variable and all smart contract functions are called using this

        auctionInstance = instance;

        assert(

          auctionInstance !== undefined,

          'Auction contract should be defined'

        );

      });

    });

    it('Initial rule with corrected startingPrice and minimumStep', function() {

      //Fetching the rule of Auction

      return auctionInstance.rule().then(function(rule) {

        //We save the instance in a global variable and all smart contract functions are called using this

        assert(rule !== undefined, 'Rule should be defined');

 

        assert.equal(rule.startingPrice, 50, 'Starting price should be 50');

        assert.equal(rule.minimumStep, 5, 'Minimum step should be 5');

      });

    });

  });

  describe('register function test case',function(){
    it('Only Auctioneer can register bidders',function(){
        return auctionInstance.register(accounts[1],200,{from:accounts[2]})
        .then(function(result){
            throw("Fail to check Auctioneer");
        }).catch(function(e){
            if(e === "Fail to check Auctioneer"){
                assert(false);
            }else{
                assert(true);
            }
        })
    });

    it('This action is only available in Created State',function(){
        //     return auctionInstance.register(accounts[2],200,{from:accounts[2]})
        // .then(function(result){
        //     throw("Fail to check validStage");
        // }).catch(function(e){
        //     if(e==="Fail to check validStage"){
        //         assert(false);
        //     }else{
        //        return auctionInstance.state()
        //        .then(function(state){
        //            assert(state == 0 ,"This action is only available in Created State");
        //        })
        //     }

        // })
        let stateRegister;
        return auctionInstance.state()
        .then(function(state){
            stateRegister = state;
        })
        .then(function(){
            return auctionInstance.register(accounts[1],200,{from:accounts[0]})
            .then(function(result){
                return auctionInstance.register(accounts[2],200,{from:accounts[0]})
            })
            .then(function(){
                return auctionInstance.register(accounts[3],200,{from:accounts[0]})
            })
            .then(function(){
                return auctionInstance.register(accounts[4],200,{from:accounts[0]})
            })
        })
        .then(function(){
            throw('This action register is only available in Created State');
        })
        .catch(function(e){
            if(e == 'This action register is only available in Created State'){
                assert(stateRegister == 0);
            }else{
                assert(false);
            }
        })
        
    });

    it('When register, the account address and the number of tokens need to be inputted',function(){
        return auctionInstance.register({from:accounts[0]})
        .then(function(result){
            throw('Fail to check the account address and the number of tokens need to be inputted');
        })
        .catch(function(e){
            if(e === 'Fail to check the account address and the number of tokens need to be inputted'){
                assert(false);
            }else{
                assert(true);
            }

        })
        
    });
  });

  describe('Start the session function test case',function(){
    it('Only Auctioneer can start the session',function(){
        return auctionInstance.startSession({from:accounts[2]})
        .then(function(instance){
            throw("Fail to check Only Auctioneer can start the session");
        }).catch(function(e){
            if(e === "Fail to check Only Auctioneer can start the session"){
                assert(false);
            }else{
                assert(true);
            }
        })
    });

    it('This action is only available in Created State',function(){
        let stateStartSession;
        return auctionInstance.state()
        .then(function(state){
            stateStartSession = state;
        })
        .then(function(){
            return auctionInstance.startSession({from:accounts[0]}) 
        })
        .then(function(){
            throw('This action start session is only available in Created State');
        })
        .catch(function(e){
            if(e == 'This action start session is only available in Created State'){
                assert(stateStartSession == 0);
            }else{
                assert(false);
            }
        })
    });
  });

  describe('Bid function test case',function(){
    it('All the Bidders can bid',function(){
 
            return auctionInstance.bid(60,{from:accounts[1]})
        .then(function(){
            return auctionInstance.bid(70,{from:accounts[2]})
        })
        .then(function(){
            return auctionInstance.bid(80,{from:accounts[3]})
        })
        .then(function(){
            return auctionInstance.bid(90,{from:accounts[4]})
        })
        .then(function(){
            throw('All the Bidders can bid');
        })
        .catch(function(e){
            if(e === 'All the Bidders can bid'){
                assert(true);
            }else{
                assert(false)
            }
        })
    });

    it('This action is only available in Started State.',function(){
        return auctionInstance.state()
        .then(function(state){
            assert(state == 1);
        })
    });
    it('The next price must be inputted',function(){
        return auctionInstance.bid({from:accounts[1]})
        .then(function(result){
            throw('Fail to check next price');
        })
        .catch(function(e){
            if(e === 'Fail to check next price'){
                assert(false);
            }else{
                assert(true);
            }
        })
    });

    it('The next price must higher than the latest price plus the minimum step',function(){
        return auctionInstance.bid(94,{from:accounts[1]})
        .then(function(result){
            throw('Fail to check next price value');
        })
        .catch(function(e){
            if(e === 'Fail to check next price value'){
                assert(false);
            }else{
                assert(true);
            }
        })
    });

  });

  describe('Announce test case',function(){
    it('Only the Auctioneer can Announce',function(){
        return auctionInstance.announce({from:accounts[4]})
        .then(function(){
            throw('Only the Auctioneer can Announce');
        })
        .catch(function(e){
            if(e == 'Only the Auctioneer can Announce'){
                assert(fasle);
            }else{
                assert(true);
            }
        })
    });

    it('This action is only available in Started State',function(){
        return auctionInstance.state()
        .then(function(state){
            assert(state == 1);
        })
    });

    it('After 3 times (4th call of this action), the session will end',function(){
        return auctionInstance.announce({from:accounts[0]})
        .then(function(){
            return auctionInstance.announce({from:accounts[0]})
        })
        .then(function(){
            return auctionInstance.announce({from:accounts[0]})
        })
        .then(function(){
            return auctionInstance.announce({from:accounts[0]})
        })
        .then(function(){
            return auctionInstance.state()
            
        })
        .then(function(state){
            assert(state == 2);
        })
    });

  });

  describe('Get back the deposit test case',function(){
    it('All the Bidders (except the Winner) can Get back the deposit',function(){
        return auctionInstance.currentWinner()
        .then(function(currentWinner){
            return auctionInstance.getDeposit({from:accounts[currentWinner]})
        })
        .then(function(result){
            throw('All the Bidders (except the Winner) can Get back the deposit');
        })
        .catch(function(e){
            if(e == 'All the Bidders (except the Winner) can Get back the deposit'){
                assert(false);
            }else{
                assert(true);
            }
        })
    });

    it('This action is only available in Closing State',function(){
        let stateGetDeposite;
        return auctionInstance.state()
        .then(function(state){
            stateGetDeposite = state;
        })
        .then(function(){
            return auctionInstance.currentWinner()
            .then(function(currentWinner){
                for(var i=1;i < 5;i++){
                    if(accounts[i] != currentWinner){
                        return auctionInstance.getDeposit({from:accounts[i]})
                    }
                }
            })
            
        })
        .then(function(){
            throw('This action getDeposit is only available in Closing State');
        })
        .catch(function(e){
            if(e == 'This action getDeposit is only available in Closing State'){
                assert(stateGetDeposite ==2);
            }else{
                assert(false);
            }
        })
    });
  });

});

 