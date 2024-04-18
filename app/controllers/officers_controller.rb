class OfficersController < ApplicationController
    before_action :set_officer, only: [:show, :edit, :update, :destroy]
    before_action :check_login
    authorize_resource
  
    def index
      @active_officers = Officer.active.alphabetical.paginate(page: params[:page]).per_page(15)
      @inactive_officers = Officer.inactive.alphabetical.paginate(page: params[:page]).per_page(15)
    end
  
    def show
      @officer = Officer.find(params[:id])
      @current_assignments = @officer.assignments.current.paginate(page: params[:page]).per_page(15)
      @past_assignments = @officer.assignments.past.paginate(page: params[:page]).per_page(15)
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
  
    def edit
      @officer = Officer.find(params[:id])
    end
  
    def update
      if @officer.update(officer_params)
        redirect_to officer_path(@officer), notice: "Successfully created #{@officer.proper_name}."
      else
        render :edit
      end
    end
  
    def destroy
      @officer = Officer.find(params[:id])
      if @officer.destroy
        redirect_to officers_path, notice: "Removed #{@officer.proper_name} from the system."
      else
        @current_assignments = @officer.assignments.current.paginate(page: params[:page], per_page: 15)
        @past_assignments = @officer.assignments.past.paginate(page: params[:page], per_page: 15)
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
  