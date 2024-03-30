class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception


  rescue_from CanCan::AccessDenied do |exception|
    flash[:error] = "Go away or I shall taunt you a second time."
    redirect_to home_path
  end

  rescue_from ActiveRecord::RecordNotFound do |exception|
    flash[:error] = "We apologize, but this information could not be found."
    redirect_to home_path
  end

  private
  def current_user
    @current_user ||= Officer.find(session[:officer_id]) if session[:officer_id]
  end
  helper_method :current_user

  def logged_in?
    current_user
  end
  helper_method :logged_in?

  def check_login
    redirect_to login_path, alert: "You must be logged in to access this section" unless current_officer_present?
  end

  def current_officer_present?
     session[:officer_id].present?
  end

  
  
end