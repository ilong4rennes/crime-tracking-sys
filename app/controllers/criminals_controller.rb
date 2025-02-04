class CriminalsController < ApplicationController
    before_action :set_criminal, only: [:show, :edit, :update, :destroy]
    before_action :check_login
    authorize_resource
  
    def index
      @criminals = Criminal.alphabetical
      @enhanced_powers = Criminal.enhanced
    end
  
    def new
      @criminal = Criminal.new
    end
  
    def create
      @criminal = Criminal.new(criminal_params)
      if @criminal.save
        flash[:notice] = "Successfully added #{@criminal.proper_name} to GCPD."
        redirect_to criminal_path(@criminal)
      else
        render :new
      end
    end
  
    def show
      @suspects = @criminal.suspects
    end
  
    def edit; end
  
    def update
      if @criminal.update(criminal_params)
        flash[:notice] = "Successfully updated the criminal."
        redirect_to @criminal
      else
        render :edit
      end
    end
  
    def destroy
      @criminal.destroy
      flash[:notice] = "Removed #{@criminal.proper_name} from the system."
      redirect_to criminals_path
    end
  
    private
  
    def set_criminal
      @criminal = Criminal.find(params[:id])
    end
  
    def criminal_params
      params.require(:criminal).permit(:first_name, :last_name, :aka, :convicted_felon, :enhanced_powers)
    end
  end
  