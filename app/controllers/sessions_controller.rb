class SessionsController < ApplicationController
    def new
    end
    
    def create
    #   user = Officer.authenticate(params[:username], params[:password])
    officer = Officer.find_by(username: params[:username])
      if officer && officer.authenticate(params[:password])
        session[:officer_id] = officer.id
        redirect_to home_path, notice: "Logged in!"
      else
        flash.now.alert = "Username and/or password is invalid"
        render "new"
      end
    end
    
    def destroy
      session[:officer_id] = nil
      redirect_to home_path, notice: "Logged out!"
    end
  end