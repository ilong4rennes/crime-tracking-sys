class OfficersController < ApplicationController
    before_action :set_officer, only: [:show, :edit, :update, :destroy]
    before_action :check_login
    authorize_resource
  
    def index
      @active_officers = Officer.active.alphabetical
      @inactive_officers = Officer.inactive.alphabetical
    end
  
    def show
      # Current and past assignments can be set up here if they're not directly accessible via @officer in the view
      @current_assignments = @officer.assignments.current
      @past_assignments = @officer.assignments.past
    end
  
    def new
      @officer = Officer.new
    end
  
    def create
      @officer = Officer.new(officer_params)
      if @officer.save
        flash[:notice] = "Successfully created #{@officer.proper_name}."
        redirect_to officer_path(@officer)
      else
        render :new
      end
    end
  
    def edit; end
  
    def update
      if @officer.update(officer_params)
        redirect_to officer_path(@officer), notice: "Successfully created #{@officer.proper_name}."
      else
        render :edit
      end
    end
  
    def destroy
      if @officer.destroy
        redirect_to officers_path, notice: "Removed #{@officer.proper_name} from the system."
      else
        render :show
      end
    end
  
    private
  
    def set_officer
      @officer = Officer.find(params[:id])
    end
  
    def officer_params
      params.require(:officer).permit(:active, :ssn, :rank, :first_name, :last_name, :unit_id, :username, :password, :password_confirmation, :role)
    end
  end
  