player, playerPed = PlayerId(), PlayerPedId()

CreateThread(function()
    while true do
        Wait(3000)

        player = PlayerId()
        playerPed = PlayerPedId()
    end
end)

CreateThread(function()
    local isDead = false
    local hasBeenDead = false
    local diedAt

    while true do
        Wait(400)

        if (NetworkIsPlayerActive(player) and DoesEntityExist(playerPed)) then

            if (IsPedFatallyInjured(playerPed) and not isDead) then
                isDead = true

                if (not diedAt) then diedAt = GetGameTimer() end

                local killer, killerWeapon = NetworkGetEntityKillerOfPlayer(player)
                local killerEntityType = GetEntityType(killer)
                local killerType = -1
                local killerInVehicle = false
                local killerVehicleName = ''
                local killerVehicleSeat = 0

                if (killerEntityType == 1) then
                    killerType = GetPedType(killer)

                    if (IsPedInAnyVehicle(killer, false) == 1) then
                        killerInVehicle = true
                        killerVehicleName = GetDisplayNameFromVehicleModel(
                            GetEntityModel( GetVehiclePedIsUsing(killer) )
                        )
                        killerVehicleSeat = GetPedVehicleSeat(killer)
                    else killerInVehicle = false end
                end

                local killerId = GetPlayerFromEntityId(killer)
                if (killer ~= playerPed and killerId ~= false and NetworkIsPlayerActive(killerId)) then
                    killerId = GetPlayerServerId(killerId)
                else killerId = -1 end

                if (killer == playerPed or killer == -1) then
                    TriggerEvent('baseevents:onPlayerDied', killerType, { table.unpack( GetEntityCoords(playerPed) ) } )
                    TriggerServerEvent('baseevents:onPlayerDied', killerType, { table.unpack( GetEntityCoords(playerPed) ) } )

                    hasBeenDead = true
                else
                    TriggerEvent('baseevents:onPlayerDied', killerType, {
                        table.unpack( GetEntityCoords(playerPed) )
                    })
                    TriggerServerEvent('baseevents:onPlayerDied', killerType, {
                        table.unpack( GetEntityCoords(playerPed) )
                    })

                    TriggerEvent('baseevents:onPlayerKilled', killerId,
                        {
                            killerType = killerType,
                            weaponHash = killerWeapon,
                            killerInVehicle = killerInVehicle,
                            killerVehicleSeat = killerVehicleSeat,
                            killerVehicleName = killerVehicleName,
                            killerCoords = { table.unpack(GetEntityCoords(killerId)) }
                        }
                    )
                    TriggerServerEvent('baseevents:onPlayerKilled', killerId,
                        {
                            killerType = killerType,
                            weaponHash = killerWeapon,
                            killerInVehicle = killerInVehicle,
                            killerVehicleSeat = killerVehicleSeat,
                            killerVehicleName = killerVehicleName,
                            killerCoords = { table.unpack(GetEntityCoords(killerId)) }
                        }
                    )

                    hasBeenDead = true
                end
            end
        end
    end
end)

GetPlayerFromEntityId = function(entityId)
    for _, player in ipairs(GetActivePlayers()) do
        if (NetworkIsPlayerActive(player) and GetPlayerPed(player) == entityId) then
            return player
        end
    end

    return false
end