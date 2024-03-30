class UnitsController < ApplicationController
    before_action :set_unit, only: [:show, :edit, :update, :destroy]
  
    def index
      @active_units = Unit.where(active: true)
      @inactive_units = Unit.where(active: false)
    end
  
    def new
      @unit = Unit.new
    end
  
    def create
      @unit = Unit.new(unit_params)
      if @unit.save
        flash[:notice] = "Successfully added #{@unit.name} to GCPD."
        redirect_to units_path
      else
        render :new
      end
    end
  
    def show
      @officers = @unit.officers
    end
  
    def edit
    end
  
    def update
      if @unit.update(unit_params)
        redirect_to unit_path(@unit)
      else
        render :edit
      end
    end
  
    # def destroy
    #   @unit = Unit.find(params[:id])
    #   if @unit.officers.exists?
    #     redirect_to units_path, alert: 'Unit cannot be removed while it has officers assigned.'
    #   else
    #     @unit.destroy
    #     flash[:notice] = "Removed #{@unit.name} from the system."
    #     redirect_to units_path
    #   end
    #     # @unit = Unit.find(params[:id])
    #     # @unit.destroy
    #     # flash[:notice] = "Removed #{@unit.name} from the system."
    #     # redirect_to units_path
    # end

    def destroy
        if @unit.destroy
          redirect_to units_path, notice: "Removed #{@unit.name} from the system."
        else
          render :index
        end
      end
  
    private
  
    def set_unit
      @unit = Unit.find(params[:id])
    end
  
    def unit_params
      params.require(:unit).permit(:active, :name)
    end
  end
  