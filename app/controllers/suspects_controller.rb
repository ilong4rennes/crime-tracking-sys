class SuspectsController < ApplicationController
    before_action :set_suspect, only: [:terminate]
  
    def new
      @suspect = Suspect.new
      @investigation = Investigation.find(params[:investigation_id])
      @current_suspects = @investigation.suspects
    end
  
    def create
      @suspect = Suspect.new(suspect_params)
      if @suspect.save
        flash[:notice] = "Successfully added suspect."
        redirect_to investigation_path(@suspect.investigation)
      else
        render :new
      end
    end
  
    def terminate
      if @suspect.update(dropped_on: Date.current)
        redirect_to investigation_path(@suspect.investigation), notice: "Suspect was successfully terminated."
      else
        # redirect_to investigation_path(@suspect.investigation), alert: "Failed to terminate the suspect."
      end
    end
  
    private
  
    def set_suspect
      @suspect = Suspect.find(params[:id])
    end
  
    def suspect_params
      params.require(:suspect).permit(:criminal_id, :investigation_id, :added_on)
    end
  end
  